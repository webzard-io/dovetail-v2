import { CrudSorting } from "@refinedev/core";
import _ from "lodash";

export function sortData(sorting: CrudSorting, data: any[]): any[] {
  if (!sorting || sorting.length === 0) {
    return data;
  }

  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const { field, order } = sort;
      const aValue = _.get(a, field);
      const bValue = _.get(b, field);

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
    }
    return 0;
  });
}
