import React from 'react'
import Layout from '../../components/Layout'
import Title from '../../components/Title'
import { useMutation, fetcher } from '../../lib/graphql'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import Button from '../../components/Button'
import Input from '../../components/Input'
import * as Yup from 'yup'


const CREATE_CATEGORY = `
    mutation createCategory($name: String!, $slug: String!) {
      createCategory (input: {
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
  const [data, createCategory] = useMutation(CREATE_CATEGORY)
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
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
          console.log('isUnique ', result)
          return result.errors ? true : false
        })
    }),
    onSubmit: async values => {
      const data = await createCategory(values)
      if (data && !data.errors)
        router.push('/categories')
    }
  })
  return (
    <>
      <Layout>
        <Title>Criar categoria</Title>
        <div className='my-4'>
          <Button.LinkOut href='/categories'>Voltar</Button.LinkOut>
        </div>
        <div className="flex flex-col mt-8">
          <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="align-middle inline-block bg-white shadow overflow-hidden sm:rounded-lg border-b border-gray-200 p-12">
              {
                data && !!data.errors && <p className="bg-red-200 border-l-4 border-red-500 text-red-700 p-2 mb-4 w-auto">Ocorreu um erro ao salvar o dados.</p>
              }
              <form onSubmit={handleSubmit}>
                <Input name='name' placeholder='Nome' onChange={handleChange} value={values.name} type='text' errors={errors.name} />
                <Input name='slug' placeholder='Slug' onChange={handleChange} value={values.slug} type='text' textHelp='Ajuda URL`s amigáveis' errors={errors.slug} />
                <div className='m-2'>
                  <Button type='submit'>Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Categories
