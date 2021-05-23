import useSWR from 'swr'
import { useState } from 'react'

const fetcher = async (query) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: query
  })
  const json = await res.json()
  return json
}

const useQuery = queryStr => {
  const query = {
    query: queryStr
  }
  const allData = useSWR(JSON.stringify(query), fetcher)
  const { data, ...rest } = allData
  return { data: data ? data.data : null, ...rest }
  return
}

const useMutation = query => {
  const [data, setData] = useState(null)
  const mutate = async variables => {
    const mutation = {
      query,
      variables
    }
    try {
      const returnedData = await fetcher(JSON.stringify(mutation))
      setData(returnedData)
      return returnedData
    } catch (err) {
      console.log(err)
    }
  }
  return [data, mutate]
}

export { useQuery, useMutation }


