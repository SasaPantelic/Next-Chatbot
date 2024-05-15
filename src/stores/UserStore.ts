import create, { StoreApi, UseBoundStore } from 'zustand'

export interface UserStore {
    user: any
    setUser: (user: any) => void
}
export const useStore: UseBoundStore<StoreApi<UserStore>> = create<UserStore>(
    (
        set: StoreApi<UserStore>['setState'],
        get: StoreApi<UserStore>['getState']) => ({
            user: null,
            setUser: (user: any) => set({ user }),
        }))
