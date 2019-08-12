import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import useBounds from './hooks/useBounds';

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

const FlexColumnBase = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  height: 100%;
  padding: 0px;
`;

interface FlexColumnProps {
  width: number;
}

const FlexColumn = styled(FlexColumnBase)`
  width: ${(props: FlexColumnProps): number => props.width}px;
`;

interface ColumnDividerProps {
  color?: string;
  pxWidth?: number;
}

const ColumnDivider = styled(FlexColumnBase)`
  width: ${(props: ColumnDividerProps): number => props.pxWidth || 1}px;
  background-color: ${(props: ColumnDividerProps): string => props.color || 'black'};
`;

interface RowPanelProps {
  children: any[];
  initialColSizes?: number[];
  slider?: ColumnDividerProps;
}

export function RowPanel (props: RowPanelProps): ReactElement {
  const numCols = props.children.length;
  const colWidths: number[] = props.initialColSizes || new Array(numCols).fill(1.0 / numCols);
  const [widths, setWidths] = useState(colWidths);
  const [ref, bounds, setBounds] = useBounds({ liveMeasure: true });

  return <FlexRow ref={ref}>
    {React.Children.toArray(props.children).reduce((acc: React.ReactNode[], child: React.ReactNode, index: number): React.ReactNode[] => {
      if (index > 0) {
        acc.push(<ColumnDivider
          color={props.slider.color}
          pxWidth={props.slider.pxWidth}
          key={acc.length}
        >
          &nbsp;
        </ColumnDivider>);
      }
      const { width: boundsWidth } = (bounds as any);
      const colSpace = boundsWidth ? boundsWidth - ((numCols - 1) * (props.slider.pxWidth || 1)) : 0;
      const colWidth = Math.floor(colSpace * widths[index]);
      acc.push(<FlexColumn width={colWidth} key={acc.length}>
        {child}
      </FlexColumn>);
      return acc;
    }, [])}
  </FlexRow>;
}

// export class RowPanel extends React.Component<RowPanelProps> {
//   private _colWidthPercents: number[];

//   public constructor (props: RowPanelProps) {
//     super(props);
//     const numCols = this.props.children.length;
//     if (props.initialColSizes && props.initialColSizes.length !== numCols) {
//       throw new Error('Initial column size array must be equal in length to number of children.');
//     }
//     this._colWidthPercents = this.props.initialColSizes || new Array(numCols).fill(1.0 / numCols);
//   }

//   public _renderChildren (children: React.ReactNode[], size: { width: number; height: number }): React.ReactNode {
//     const numCols = children.length;
//     const { width } = size;
//     const childNodes = children.reduce((acc: React.ReactNode[], child: React.ReactNode, index: number): React.ReactNode[] => {
//       if (index > 0) {
//         acc.push(<ColumnDivider
//           color={this.props.slider.color}
//           pxWidth={this.props.slider.pxWidth}
//           key={acc.length}
//         >
//           &nbsp;
//         </ColumnDivider>);
//       }
//       const colWidthPercent = this._colWidthPercents[index];
//       const colSpace = width -
//         ((numCols - 1) * this._sliderWidth);
//       const colWidth = Math.floor(colSpace * colWidthPercent);
//       acc.push(<FlexColumn width={colWidth} key={acc.length}>
//         {child}
//       </FlexColumn>);
//       return acc;
//     }, []);
//     return childNodes;
//   }

//   public render (): ReactElement {
//     return <FlexRow>
//       {this._renderChildren(React.Children.toArray(this.props.children))}
//     </FlexRow>;
//   }
// }