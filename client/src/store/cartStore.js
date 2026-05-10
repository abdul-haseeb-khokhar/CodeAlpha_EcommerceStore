import {create} from 'zustand'

const useCartStore = create((set, get) => ({
    items: [],
    totalItems: 0,
    totalPrice: 0,


    calculateTotals: () => {
        const {items} = get()
        const totalItems = items.reduce((sum , item) => sum + item.quantity,0)
        const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

        set({totalItems, totalPrice})
    },

    setCart: (cartItems) =>{
        set({items: cartItems})
        get().calculateTotals()
    },

    clearCart: () => {
        set({items: [], totalItems: 0, totalPrice: 0})
    }
}))

export default useCartStore