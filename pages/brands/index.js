import React from 'react';
import Layout from '../../components/Layout';
import Title from '../../components/Title';
import Table from '../../components/Table';
import { useMutation, useQuery } from '../../lib/graphql';
import Link from 'next/link';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const GET_ALL_BRAND = `
  query {
    getAllBrands {
      id
      name
      slug
    }
  }
`;
const DELETE_BRAND = `
  mutation deleteBrand ($id: String!) {
    deleteBrand (id: $id) 
  }
`;

const Brands = () => {
  const { data, mutate } = useQuery(GET_ALL_BRAND);
  const [deleteData, deleteBrand] = useMutation(DELETE_BRAND);
  const remove = id => async () => {
    await deleteBrand({ id });
    mutate();
  };
  return (
    <>
      <Layout>
        <Title>Gerenciar Marcas</Title>
        <div className='my-4'>
          <Button.Link href='./brands/create'>Cadastrar Marca</Button.Link>
        </div>

        <div className="mt-8">

        </div>

        {data && data.getAllBrands && data.getAllBrands.length === 0 && (

          <Alert >Nenhuma marca criada.</Alert>

        )}

        {data && data.getAllBrands && data.getAllBrands.length > 0 && (
          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div
                className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <Table>
                  <Table.Head>
                    <Table.Th>Name</Table.Th>
                    <Table.Th></Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Head>

                  <Table.Body>
                    {data && data.getAllBrands && data.getAllBrands.map(item => {
                      return (<Table.Tr key={item.id}>

                        <Table.Td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <div className="flex items-center">

                            <div className="ml-4">
                              <div className="text-sm leading-5 font-medium text-gray-900">{item.name}
                              </div>
                              <div className="text-sm leading-5 text-gray-500">{item.slug}</div>
                            </div>
                          </div>
                        </Table.Td>

                        <Table.Td
                          className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                          <Link href={`/brands/${item.id}/edit`}>
                            <a className="text-indigo-600 hover:text-indigo-900">Edit</a>
                          </Link>
                        </Table.Td>
                        <Table.Td
                          className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                          <a href='#' className="text-indigo-600 hover:text-indigo-900" onClick={remove(item.id)}>Delete</a>
                        </Table.Td>
                      </Table.Tr>);
                    })}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Brands;
