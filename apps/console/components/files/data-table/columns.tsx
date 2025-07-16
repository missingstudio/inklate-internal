import { DataTableColumnHeader } from "./data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@inklate/ui/badge";

export const labels = [
  {
    value: "bug",
    label: "Bug"
  },
  {
    value: "feature",
    label: "Feature"
  },
  {
    value: "documentation",
    label: "Documentation"
  }
];

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="File" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex gap-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">{row.getValue("title")}</span>
        </div>
      );
    }
  }
];
