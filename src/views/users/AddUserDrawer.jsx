import { useEffect } from 'react'

import { Button, Divider, Drawer, MenuItem, Typography, IconButton } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import { saveUser } from '@/services/users.service'
import { Notify } from '@/utils/notification'

export default function AddUserDrawer(props) {
  const { open, handleClose, titleForm, userFormData, setReload, reload } = props

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      names: '',
      lastNames: '',
      username: '',
      role: '1'
    }
  })

  useEffect(() => {
    if (open) {
      resetForm({
        names: userFormData.names ?? '',
        lastNames: userFormData.lastNames ?? '',
        username: userFormData.userName ?? userFormData.username ?? '',
        role: String(userFormData.role ?? '1')
      })
    }
  }, [open, userFormData, resetForm])

  const onSubmit = async data => {
    const newUser = {
      id: Object.keys(userFormData).length > 0 ? userFormData.id : 0,
      avatar: `/images/avatars/${Math.floor(Math.random() * 8) + 1}.jpg`,
      names: data.names,
      lastNames: data.lastNames,
      username: data.username,
      role: data.role
    }

    const response = await saveUser(newUser)

    if (response.isSuccess) {
      //setReload(prev => !prev)
      setReload(!reload)
      handleClose()
      Notify(response.message, 'Success')
    } else {
      Notify(response.message, 'Error')
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>{titleForm}</Typography>
        <IconButton onClick={handleClose} size='small'>
          <i className='tabler-x' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6 p-6'>
          <Controller
            name='names'
            control={control}
            rules={{ required: 'Nombres es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Nombres'
                placeholder='Ingrese los nombres'
                error={!!errors.names}
                {...(errors.names && { error: true, helperText: errors.names.message })}
              />
            )}
          />

          <Controller
            name='lastNames'
            control={control}
            rules={{}}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Apellidos'
                placeholder='Ingrese los apellidos'
                error={!!errors.lastNames}
                {...(errors.lastNames && { error: true, helperText: errors.lastNames.message })}
              />
            )}
          />

          <Controller
            name='username'
            control={control}
            rules={{ required: 'Username es requerido' }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Username'
                placeholder='Ingrese el username'
                error={!!errors.username}
                {...(errors.username && { error: true, helperText: errors.username.message })}
              />
            )}
          />

          <Controller
            name='role'
            control={control}
            rules={{ required: 'Role es requerido' }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-role'
                label='Select Role'
                placeholder='Selecciona un rol'
                {...field}
                {...(errors.role && { error: true, helperText: errors.role.message })}
              >
                <MenuItem value='1'>Admin</MenuItem>
                <MenuItem value='0'>User</MenuItem>
              </CustomTextField>
            )}
          />

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='button' onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}
