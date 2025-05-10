const cartContainer = document.getElementById('cart-container');
const cartHeader = document.getElementById('cart-header');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const baseUrl = 'http://localhost:3000';

async function fetchCartItems() {
    try {
        const response = await fetch(`${baseUrl}/cart`);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

async function fetchDish(dishId) {
    try {
        const response = await fetch(`${baseUrl}/dishes/${dishId}`);
        if (!response.ok) throw new Error(`Failed to fetch dish ${dishId}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching dish ${dishId}:`, error);
        return null;
    }
}

async function removeCartItem(cartItemId) {
    try {
        const response = await fetch(`${baseUrl}/cart/${cartItemId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Item removed from cart!');
            await renderCart(); // Re-render after removal
            updateCartCount(); // Update header cart count
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
    }
}

async function clearCart() {
    try {
        const response = await fetch(`${baseUrl}/cart/clear`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Cart cleared!');
            await renderCart(); // Re-render after clearing
            updateCartCount(); // Update header cart count
        } else {
            throw new Error('Failed to clear cart');
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

async function renderCart() {
    const cartItems = await fetchCartItems();

    // Clear previous header buttons
    const existingClearButton = cartHeader.querySelector('.clear-cart-btn');
    if (existingClearButton) existingClearButton.remove();

    // Add Clear Cart button to header if there are items
    if (cartItems.length > 0) {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Cart';
        clearButton.className = 'clear-cart-btn px-3 py-1 border-2 border-red-500 rounded-md bg-red-500 font-["Martel_Sans"] font-semibold text-sm text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 ease-in-out';
        clearButton.addEventListener('click', clearCart);
        cartHeader.appendChild(clearButton);
    }

    cartContainer.innerHTML = '';
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="font-[\'Poppins\'] text-2xl text-[#3f4255] text-center my-12">Your cart is empty</p>';
        totalPriceElement.textContent = '';
        return;
    }

    // Fetch dish details for each cart item
    const dishPromises = cartItems.map(item => fetchDish(item.dishId));
    const dishes = (await Promise.all(dishPromises)).filter(dish => dish !== null);

    // Calculate total price
    let totalPrice = 0;
    const cartWithDishes = cartItems
        .map(item => {
            const dish = dishes.find(d => d.id === item.dishId);
            if (dish) {
                totalPrice += dish.price * item.quantity;
                return {
                    ...item,
                    dish
                };
            }
            return null;
        })
        .filter(item => item !== null);

    // Update total price
    totalPriceElement.textContent = `Total: €${totalPrice.toFixed(2)}`;

    // Render each cart item as a card
    cartWithDishes.forEach(item => {
        const {
            dish
        } = item;
        const card = document.createElement('div');
        card.className = 'w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50';
        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
            <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
                <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
                <p class="text-sm mb-2">${dish.description}</p>
                <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p>
                <p class="text-sm mb-2">Quantity: ${item.quantity}</p>
                <p class="text-sm mb-2">Subtotal: €${(dish.price * item.quantity).toFixed(2)}</p>
                <p class="text-sm">Category: ${dish.category}</p>
                <div class="flex justify-between items-center gap-2 mt-2">
                    <button class="remove-btn bg-red-500 text-white px-2 py-1 rounded w-[120px]" data-cart-id="${item.id}">
                        Remove
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(card);
    });
}

// Event listener for removing individual cart items
cartContainer.addEventListener('click', async (e) => {
    if (e.target.closest('.remove-btn')) {
        const btn = e.target.closest('.remove-btn');
        const cartItemId = parseInt(btn.dataset.cartId);
        await removeCartItem(cartItemId);
    }
});

// Event listener for checkout button
checkoutBtn.addEventListener('click', async () => {
    const cartItems = await fetchCartItems();
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout... (This is a demo)');
    // In a real app, this would redirect to a checkout page or process payment
});

// Function to update cart count in header
async function updateCartCount() {
    try {
        const cartItems = await fetchCartItems();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

async function init() {
    await renderCart();
    updateCartCount();
}

init();