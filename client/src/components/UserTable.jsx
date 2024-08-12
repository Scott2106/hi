import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

import { MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PropTypes from "prop-types";

// import { CaretUpIcon, CaretDownIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import {api} from "@/interceptors/axios";

const UserTable = ({ users, updateUserData }) => {
  const roles = [
    {
      role_id: 1,
      role_name: "Super Admin",
    },
    {
      role_id: 2,
      role_name: "Owner",
    },
    {
      role_id: 3,
      role_name: "Site Admin",
    },
    {
      role_id: 4,
      role_name: "Site Manager",
    },
    {
      role_id: 5,
      role_name: "Standard User",
    },
  ];

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="bg-gray-700"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="bg-gray-700"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "site_name",
      header: "Site",
    },
    {
      accessorKey: "role_name",
      header: "Role",
      cell: (row) => row.getValue().slice(5),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-700"
                onClick={() => {
                  api
                    .delete(
                      `/superAdmin/users/${data.user_id}/${data.site_id}`
                    )
                    .then(() => {
                      console.log(
                        "Remove from site",
                        data.user_id,
                        data.site_id
                      );
                      updateUserData();
                      setRowSelection({});
                    });
                }}
              >
                Remove from site
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Update Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.role_id}
                        onClick={() => {
                          api
                            .put(
                              "/superAdmin/users/",
                              {
                                user_id: data.user_id,
                                site_id: data.site_id,
                                role_permission_id: role.role_id,
                              }
                            )
                            .then(() => {
                              console.log(
                                "Update role",
                                data.user_id,
                                data.site_id,
                                role,
                                role.role_id
                              );
                              updateUserData();
                              setRowSelection({});
                            });
                        }}
                      >
                        {role.role_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const data = useMemo(() => users, [users]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // const [sorting, setSorting] = useState([]);

  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      // sorting: sorting,
      pagination,
      globalFilter: filtering,
      rowSelection,
    },
    onPaginationChange: setPagination,
    // onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div>
      <Input
        type="text"
        className="bg-gray-800 w-1/4 mt-4"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
      />
      <div className="flex-1 text-muted-foreground mt-2">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button
            className="mx-4 bg-red-900 text-white p-2"
            onClick={() => {
              const dataArr = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => {
                  const data = row.original;
                  return [
                    {
                      user_id: data.user_id,
                      site_id: data.site_id,
                    },
                  ];
                });
              api
                .delete("/superAdmin/users", {
                  data: {
                    dataArr,
                  },
                })
                .then(() => {
                  console.log("Remove from site", dataArr);
                  updateUserData();
                  setRowSelection({});
                });
            }}
          >
            Remove
          </Button>
        ) : null}
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    <div className="flex align-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow className="border-gray-700" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell className="p-2" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-center m-2">
        Showing {table.getPaginationRowModel().rows.length} of{" "}
        {table.getRowCount()} entries
      </p>

      <div className="flex justify-center">
        <Button
          className="bg-slate-800 mx-1"
          onClick={table.firstPage}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          className="bg-slate-800 mx-1"
          onClick={table.previousPage}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          className="bg-slate-800 mx-1"
          onClick={table.nextPage}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          className="bg-slate-800 mx-1"
          onClick={table.lastPage}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
      </div>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  updateUserData: PropTypes.func.isRequired,
};

export default UserTable;
