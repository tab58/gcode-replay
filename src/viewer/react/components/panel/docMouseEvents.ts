import { fromEvent, Observable } from 'rxjs';
import { switchMap, map, takeUntil } from 'rxjs/operators';

const preventer = map((e: MouseEvent): MouseEvent => {
  e.preventDefault();
  return e;
});

const docMouseDown = fromEvent<MouseEvent>(document, 'mousedown').pipe(preventer);
const docMouseUp = fromEvent<MouseEvent>(document, 'mouseup').pipe(preventer);
const docMouseMove = fromEvent<MouseEvent>(document, 'mousemove').pipe(preventer);

export const docMouseDrag = docMouseDown.pipe(
  switchMap((): Observable<MouseEvent> => docMouseMove.pipe(
    takeUntil(docMouseUp)
  ))
);