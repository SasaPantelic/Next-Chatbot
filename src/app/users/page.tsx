"use client"
import React, { useEffect } from 'react'
import { User } from '../../types/data-models';
import Link from 'next/link';
import { capitalize } from '../../lib/utils';
import TripleDotLoader from '../components/TripleDotLoader';

type Props = {}

const Users = (props: Props) => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        fetch('/api/users').then(res => res.json()).then(data => {
            console.log('data', data)
            setLoading(false);
            setUsers(data);
        })
    }, []);

     // Get age from birthday
     const getAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


  return (
    <div
    className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'
    >
        {loading && (
        <TripleDotLoader
        className="w-20 h-20 mt-6"
     />
         )}
        {users.map((user) => {
            return (
                <Link 
                href={`/users/${user.username}`}
                className='flex flex-col border shadow-md p-4 m-4 rounded-md'
                key={user.username}>
                    <img
                    className='rounded-full w-16 h-16'
                    src={user.image} />
                    <h1
                    className='text-xl font-bold'
                    >{user.username}</h1>
                    <div
                    className='flex'
                    >
                    <p
                    className='text-sm text-gray-500'
                    >{capitalize(user.gender)}</p>
                    <p
                    className='text-sm text-gray-500 ml-1'
                    >{getAge(user.birthday)}</p>
                    </div>

                    <p
                    className='text-sm truncate'
                    >{user.description}</p>

                </Link>
            )
        })}
    </div>
  )
}

export default Users