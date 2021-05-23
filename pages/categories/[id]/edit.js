import React, { useEffect } from 'react'
import Layout from '../../../components/Layout'
import Title from '../../../components/Title'
import { useMutation, useQuery, fetcher } from '../../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import * as Yup from 'yup'

let id = ''
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
  id = router.query.id
  const { data } = useQuery(`
    query{
      getCategoryById (id:"${router.query.id}"){
      name
      slug
    }
  }
  `)
  const [updatedData, updateCategory] = useMutation(UPDATE_CATEGORY)
  const { handleSubmit, handleChange, setFieldValue, values, touched, errors } = useFormik({

    initialValues: {
      name: '',
      slug: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'O nome deve ter ao menos 3 caracteres.')
        .required('Campo obrigatório.'),
      slug: Yup.string()
        .min(3, 'O slug deve ter ao menos 3 caracteres.')
        .required('Campo obrigatório.')
        .test('isUnique', 'Este slug já existe.', async (value) => {
          const result = await fetcher(JSON.stringify({
            query: `
              query {
                getCategoryBySlug( slug: "${value}"){
                  id
                }
              }
          `}))
          if (result.data && result.data.getCategoryBySlug.id === id)
            return true
          return result.errors ? true : false
        })
    }),
    onSubmit: async values => {
      const category = {
        id: router.query.id,
        ...values
      }
      const data = await updateCategory(category)
      if (data && !data.errors)
        router.push('/categories')
    }
  })
  useEffect(() => {
    if (data && data.getCategoryById) {
      setFieldValue('name', data.getCategoryById.name)
      setFieldValue('slug', data.getCategoryById.slug)
    }
  }, [data])
  return (
    <>
      <Layout>
        <Title>Editar categoria</Title>
        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12">
              {
                updatedData && !!updatedData.errors && <p className="bg-red-200 border-l-4 border-red-500 text-red-700 p-2 mb-4 w-auto">Ocorreu um erro ao salvar o dados.</p>
              }
              <form onSubmit={handleSubmit}>
                <Input type='text' name='name' placeholder='Nome' onChange={handleChange} value={values.name} errors={errors.name} />
                <Input type='text' name='slug' placeholder='Slug' onChange={handleChange} value={values.slug} errors={errors.slug} textHelp='Ajuda URL`s amigáveis' />
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
