export interface FormWidgetProps<V> {
  value?: V;
  onChange?: (value: V)=> void;
  [prop: string]: unknown;
}
