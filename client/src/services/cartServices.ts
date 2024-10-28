import apiClient from "./index.ts"

export {
    addToCart,
    getUserCart,
    updateQuantity,
    removeFromCart
}

const getUserCart = async() => {
    const response = await apiClient.get('/cart');
    return response.data.data
}

const updateQuantity = async(data : any) => {
    const response = await apiClient.patch('/cart/update',data);
    return response.data.data
}

const removeFromCart = async(cartProductId : string) => {
    const response = await apiClient.delete('/cart/remove', {
        params: { cartProductId },
      });
    return response.data.data
}

const addToCart = async(data : any) => {
    const response = await apiClient.post('/cart/add',data);
    return response.data.data
}
