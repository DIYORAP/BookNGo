import React, { useState } from 'react';

const CartComponent = () => {
    const [items, setItems] = useState(0);
    const [cart, setCart] = useState([]);

    return (
        <div className='bg-white border-x-0  w-1/2 h-28 flex flex-col justify-center'>
            <div className="flex  flex-col items-center space-y-4 w-full h-full rounded-md border-blue-700 border-2 p-4">
                {/* Minus Button */}
                {/* <button
                        onClick={() => {
                            let count = items - 1;
                            if (count < 1) {
                                count = 0;
                            }
                            setItems(count);
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-blue-700 rounded-lg hover:bg-gray-300 ml-44"
                    >
                        <svg
                            width="12"
                            height="4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 12 4"
                        >
                            <path d="M11.357 3.332A.641.641 0 0 0 12 2.69V.643A.641.641 0 0 0 11.357 0H.643A.641.641 0 0 0 0 .643v2.046c0 .357.287.643.643.643h10.714Z" />
                        </svg>
                    </button> */}

                {/* Item Count */}
                {/* <span className="text-xl font-semibold">{items}</span> */}

                {/* Plus Button */}
                {/* <button
                        onClick={() => {
                            let count = items + 1;
                            if (count <= 10) {
                                setItems(count);
                            }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-blue-700 rounded-lg hover:bg-gray-300"
                    >
                        <svg
                            width="12"
                            height="12"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="white"
                            viewBox="0 0 12 12"
                        >
                            <path d="M12 7.023V4.977a.641.641 0 0 0-.643-.643h-3.69V.643A.641.641 0 0 0 7.022 0H4.977a.641.641 0 0 0-.643.643v3.69H.643A.641.641 0 0 0 0 4.978v2.046c0 .356.287.643.643.643h3.69v3.691c0 .356.288.643.644.643h2.046a.641.641 0 0 0 .643-.643v-3.69h3.691A.641.641 0 0 0 12 7.022Z" />
                        </svg>
                    </button>
                </div> */}

                {/* Total Price */}
                <span className="text-xl font-semibold">$123</span>

                {/* Add to Cart Button */}
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => {
                        if (items === 0) {
                            alert("Please first add items");
                        } else {
                            setCart((prevCart) => [...prevCart, items]);
                            setItems(0);
                        }
                    }}
                >
                    Add to Cart
                </button>

            </div>
        </div>
    );
};

export default CartComponent;
