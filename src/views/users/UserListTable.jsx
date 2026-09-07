'use client'

import { useMemo, useState } from 'react'

import { Avatar, Button, Card, CardHeader, IconButton, MenuItem, TablePagination, Typography } from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'

import CustomTextField from '@/@core/components/mui/TextField'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import styles from '@/@core/styles/table.module.css'
import AddUserDrawer from './AddUserDrawer'
import { deleteUser } from '@/services/users.service'
import { Notify } from '@/utils/notification'

const columnHelper = createColumnHelper()

const getAvatar = ({ avatar }) => {
  const src = avatar ? `/images/avatar/${avatar}` : '/images/avatar/1.png'

  return <Avatar src={src} sx={{ width: 34, height: 34 }} />
}

export default function UserListTable({ usersData = [], setReload, reload = false }) {
  const data = useMemo(() => (Array.isArray(usersData) ? usersData : []), [usersData])

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [titleForm, setTitleForm] = useState('')
  const [userFormData, setUserFormData] = useState({})

  const columns = useMemo(
    () => [
      columnHelper.accessor('names', {
        header: 'Nombre',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original.avatar })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.names}
              </Typography>
              <Typography variant='body2'>{row.original.lastNames}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('username', {
        header: 'Username',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.userName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Rol',
        cell: ({ row }) => (row.original.role == 1 ? 'Administrador' : 'Usuario')
      }),
      columnHelper.display({
        id: 'action',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton title='Editar' onClick={() => openEditForm(row)}>
              <i className='tabler-pencil' />
            </IconButton>
            <IconButton title='Eliminar' onClick={() => handleDelete(row)}>
              <i className='tabler-trash' />
            </IconButton>
          </div>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    getPaginationRowModel: getPaginationRowModel()
  })

  const openEditForm = row => {
    setUserFormData(row.original)
    setTitleForm('Edit User')
    setAddUserOpen(true)
  }

  const handleDelete = async row => {
    const response = await deleteUser(row.original.id)

    if (response.isSuccess) {
      setReload(!reload)
      Notify(response.message, 'Success')
    } else {
      Notify(response.message, 'Error')
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Usuarios' />

        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </CustomTextField>

          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => {
                setAddUserOpen(true)
                setTitleForm('Add New User')
                setUserFormData({})
              }}
            >
              Add New User
            </Button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>
      <AddUserDrawer
        open={addUserOpen}
        userFormData={userFormData}
        titleForm={titleForm}
        handleClose={() => setAddUserOpen(false)}
        setReload={setReload}
        reload={reload}
      />
    </>
  )
}
