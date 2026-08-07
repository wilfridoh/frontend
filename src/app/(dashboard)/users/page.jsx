'use client'
import { useEffect, useState } from 'react'

import { getUserList } from '@/services/users.service'
import UserListTable from '@/views/users/UserListTable'

export default function UserListApp() {
  const [usersData, setUsersData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [reload, setReload] = useState(false)

  const getData = async () => {
    setLoading(true)
    const response = await getUserList()

    if (response?.isSuccess) {
      setUsersData(response.data)
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [reload])

  if (isLoading) return <p>Loading...</p>

  return <UserListTable usersData={usersData} setReload={setReload} reload={reload} />
}
