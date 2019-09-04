import React, { ReactElement, useState, MouseEvent as ReactMouseEvent } from 'react';
import { useBounds } from '../../hooks/useBounds';
import { docMouseDrag } from './docMouseEvents';
import { v4 as uuid } from 'uuid';
import { Subject, Observable } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

import {
  FlexDirection,
  StyledFlexDivider,
  FlexItemContainer,
  FlexPanelContainer
} from './panelComponents';

interface FlexDividerProps {
  children: any;
  direction: FlexDirection;
  color?: string;
  pxWidth?: number;
  onDragCallback: (id: string, event: MouseEvent) => void;
  id: string;
}

function FlexDivider (props: FlexDividerProps): ReactElement {
  const [ cursor, setCursor ] = useState('auto');

  const _getResizeCursor = (): string => {
    return props.direction === 'row'
      ? 'row-resize'
      : 'col-resize';
  };

  // set up the observable
  const drag$ = new Subject<Event>();
  drag$.pipe(
    switchMap((down: MouseEvent): Observable<MouseEvent> => docMouseDrag.pipe(
      startWith(down)
    ))
  ).subscribe((e: MouseEvent): void => {
    props.onDragCallback(props.id, e);
  });

  return <StyledFlexDivider
    direction={props.direction}
    itemWidth={props.pxWidth || 1}
    color={props.color || 'black'}
    cursor={cursor}
    onMouseOver={(): void => setCursor(_getResizeCursor())}
    onMouseOut={(): void => setCursor('auto')}
    onMouseDown={(e: ReactMouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();
      drag$.next(new MouseEvent('drag', e));
    }}
  ></StyledFlexDivider>;
}

interface SliderProps {
  color?: string;
  pxWidth?: number;
}

interface SectionPanelProps {
  width: number;
  direction: FlexDirection;
  slider: SliderProps;
  children: any;
  onDragCallback: (id: string, event: MouseEvent) => void;
}

function SectionPanel (props: SectionPanelProps): React.ReactElement {
  const [ id ] = useState(uuid());
  
  const sliderWidth = props.slider.pxWidth || 1;
  const panelWidth = props.width - sliderWidth;

  return <React.Fragment>
    <FlexItemContainer
      itemWidth={panelWidth}
      key={`panel-${id}`}
      direction={props.direction}
    >
      {props.children}
    </FlexItemContainer>
    <FlexDivider
      color={props.slider.color}
      pxWidth={props.slider.pxWidth}
      key={`divider-${id}`}
      id={`${id}`}
      direction={props.direction}
      onDragCallback={props.onDragCallback}
    >
      &nbsp;
    </FlexDivider>
  </React.Fragment>;
}

interface MultiSectionPanelProps {
  children: any[];
  initialSectionSizes?: number[];
  slider?: SliderProps;
  direction: FlexDirection;
}


export function MultiSectionPanel (props: MultiSectionPanelProps): ReactElement {
  const numItems = props.children.length;
  const [ ref, panelBounds ] = useBounds({ liveMeasure: true });
  const { width: boundsWidth, height: boundsHeight } = (panelBounds as any);

  const stdWidth = 1.0 / numItems;
  const initialItemWidths: number[] = ((n: number): number[] => {
    if (props.initialSectionSizes) {
      if (props.initialSectionSizes.length < n) {

      } else if (props.initialSectionSizes.length > n) {
        
      } else {
        return props.initialSectionSizes;
      }
    } else {
      return (new Array(numItems - 1)).fill(stdWidth);
    }
  })(numItems - 1);
  const [ itemWidths, setItemWidths ] = useState(initialItemWidths);
  
  const isRow = props.direction === 'row';
  const crossDirection = isRow
    ? 'column'
    : 'row';
  const crossDirectionSpace = isRow
    ? boundsWidth
    : boundsHeight;

  const _onDividerDragCallback = (id: string, event: MouseEvent): void => {
    console.log(`calling ${id}: (${event.clientX}, ${event.clientY})`);
  };

  return <FlexPanelContainer ref={ref} direction={props.direction} >
    {React.Children.toArray(props.children).reduce((acc: React.ReactNode[], child: React.ReactNode, index: number): React.ReactNode[] => {
      const itemSpace = crossDirectionSpace ? crossDirectionSpace - ((numItems - 1) * (props.slider.pxWidth || 1)) : 0;
      const itemWidth = Math.floor(itemSpace * itemWidths[index]);
      
      if (index > 0) {
        acc.push(<SectionPanel
          width={100}
          direction={crossDirection}
          slider={props.slider}
          onDragCallback={_onDividerDragCallback}
        >
          {child}
        </SectionPanel>);
      } else {
        acc.push(<FlexItemContainer
          itemWidth={itemWidth}
          key={acc.length}
          direction={crossDirection}
        >
          {child}
        </FlexItemContainer>);
      }
      return acc;
    }, [])}
  </FlexPanelContainer>;
}