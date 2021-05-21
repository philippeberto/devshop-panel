import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import { useMutation, useQuery } from '../../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Input from '../../../components/Input'
import Button from '../../../components/Button'

const UPDATE_CATEGORY = `
    mutation updateCategory($id: String!, $name: String!, $slug: String!) {
      updateCategory (input: {
        id: $id,
        name: $name,
        slug: $slug
      }) {
        id
        name
        slug
      }
    }
  `

const Categories = () => {
  const router = useRouter()
  const { data } = useQuery(`
    query{
      getCategoryById (id:"${router.query.id}"){
      name
      slug
    }
  }
  `)
  const [updatedData, updateCategory] = useMutation(UPDATE_CATEGORY)

  const form = useFormik({
    initialValues: {
      name: '',
      slug: ''
    },
    onSubmit: async values => {
      const category = {
        id: router.query.id,
        ...values
      }
      await updateCategory(category)
      router.push('/categories')
    }
  })
  useEffect(() => {
    if (data && data.getCategoryById) {
      form.setFieldValue('name', data.getCategoryById.name)
      form.setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <>
      <Layout>
        <Title>Editar categoria</Title>
        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12">
              <form onSubmit={form.handleSubmit}>
                <Input type='text' name='name' placeholder='Nome' onChange={form.handleChange} value={form.values.name} />
                <Input type='text' name='slug' placeholder='Slug' onChange={form.handleChange} value={form.values.slug} />
                <Button type='submit'>Editar</Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Categories
