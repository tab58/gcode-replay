import styled from 'styled-components';

export type FlexDirection = 'row' | 'column';

export const FlexPanelContainer = styled.div`
  display: flex;
  flex-direction: ${(props: { direction: FlexDirection }): string => props.direction};
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  height: 100%;
  padding: 0px;
`;
FlexPanelContainer.displayName = 'FlexPanelContainer';

interface FlexItemContainerBaseProps {
  direction: FlexDirection;
}

export const FlexItemContainerBase = styled.div`
  display: flex;
  flex-direction: ${(props: FlexItemContainerBaseProps): string => props.direction};
  flex-basis: auto;
  padding: 0px;
`;

interface FlexItemContainerProps extends FlexItemContainerBaseProps {
  itemWidth: number;
}

export const FlexItemContainer = styled(FlexItemContainerBase)`
  ${(props: FlexItemContainerProps): string => {
    return (props.direction === 'row')
      ? `height: ${props.itemWidth}px; width: 100%;`
      : `width: ${props.itemWidth}px; height: 100%;`;
  }}
`;
FlexItemContainer.displayName = 'FlexItemContainer';

interface StyledFlexDividerProps extends FlexItemContainerBaseProps {
  color?: string;
  pxWidth?: number;
  cursor: string;
}

export const StyledFlexDivider = styled(FlexItemContainer)`
  background-color: ${(props: StyledFlexDividerProps): string => props.color || 'black'};
  cursor: ${(props: StyledFlexDividerProps): string => props.cursor};
`;
StyledFlexDivider.displayName = 'FlexDivider';

