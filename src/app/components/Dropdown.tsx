import { useRouter } from "next/navigation"
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { signOut, useSession } from 'next-auth/react'

export interface Props {
    button: JSX.Element
}
export default function TopbarDropdown({
    button
}: Props) {
    const router = useRouter()
    const {data:session,status} = useSession()
    return (
        <div className=" text-right hidden sm:inline-block">
            <Menu as="div" className=" relative  inline-block text-left">
                <div className=''>
                    <Menu.Button>
                        {button}
                    </Menu.Button>
                </div>
                {/* @ts-ignore */}
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    {/* @ts-ignore */}
                    <Menu.Items
                        css={{
                            zIndex: 1000,
                        }}
                        className="absolute z-100 right-0 pl-4 p-2 w-[250px] rounded-[16px] bg-white shadow-md border origin-top-right divide-y divide-gray-100">
                        <div className="px-1 py-1 pt-2 ">
                            <MenuItem
                                onClick={() => {
                                    router.push(`/users/${session?.user?.username}`)
                                }}
                            >
                               Edit Profile
                            </MenuItem>
                            <div className='cursor-pointer'>
                                <MenuItem
                                    onClick={async () => {
                                        await signOut({
                                            callbackUrl: '/',
                                        })
                                    }}
                                >
                                    Log out
                                </MenuItem>
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div >
    )
}



function MenuItem({ children, onClick }:
    {
        children: React.ReactNode
        onClick?: () => void
    }) {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    onClick={onClick}
                    className={`${active ? ' text-neutral-7' : 'text-neutral-4'
                        } group flex w-full  items-center font-semibold h-8 rounded-md p-1 text-sm text-[15px]  tracking-[-1%]`}
                >
                    {children}
                </button>
            )}
        </Menu.Item>
    )
}