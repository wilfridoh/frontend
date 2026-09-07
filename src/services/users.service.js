import axiosInstance from '@/configs/axiosConfig'

export async function getUserList() {
  const response = await axiosInstance.get('/users/List')

  return response?.data
}

export async function saveUser(userData) {
  const formData = new FormData()
  formData.append('id', userData.id)
  formData.append('names', userData.names)
  formData.append('lastNames', userData.lastNames)
  formData.append('username', userData.username)
  formData.append('password', userData.password)
  formData.append('photo', 'photo')
  formData.append('role', userData.role)

  const response = await axiosInstance.post('/users/CreateOrEdit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response?.data
}

export async function deleteUser(id) {
  const response = await axiosInstance.delete(`/users/Delete?IdUser=${id}`)
  return response?.data
}

