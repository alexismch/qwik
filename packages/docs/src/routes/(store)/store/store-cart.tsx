import { component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { STORE_CONTEXT, formatPrice } from '../utils';
import { StoreCartRows } from './store-cart-rows';

export const StoreCart = component$(() => {
  const showCartSignal = useSignal(false);
  const appStore = useContext(STORE_CONTEXT);
  const isEmptySignal = useComputed$(() => appStore.cart?.lineItems?.edges?.length > 0 || false);
  const totalQuantitySignal = useComputed$(() =>
    appStore.cart
      ? appStore.cart.lineItems.edges.reduce(
          (quantity: number, { node }: any) => quantity + node.quantity,
          0
        )
      : 0
  );
  return (
    appStore.cart && (
      <div class="cart">
        <div class="flex justify-end my-3 pr-6 text-slate-900 w-full absolute z-10">
          <button
            name="Cart"
            aria-label={`${totalQuantitySignal.value} items in cart`}
            class="relative w-12 h-12 bg-slate-600 border-2 border-gray-300 rounded-xl text-white p-1"
            onClick$={() => {
              showCartSignal.value = true;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="margin: auto"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {totalQuantitySignal.value > 0 && (
              <div class="absolute rounded-full -top-4 -right-4 text-black bg-white border-2 border-gray-300 w-8 h-8 pt-1">
                {totalQuantitySignal.value}
              </div>
            )}
          </button>
        </div>
        {showCartSignal.value && (
          <div class="fixed inset-0 overflow-hidden z-[100]">
            <div class="absolute inset-0 overflow-hidden">
              <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100"></div>
              <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div class="w-screen max-w-md translate-x-0">
                  <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                    <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div class="flex items-start justify-between">
                        <h2 class="text-lg font-medium text-gray-900">Shopping cart</h2>
                        <div class="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick$={() => (showCartSignal.value = !showCartSignal.value)}
                          >
                            <span class="sr-only">Close panel</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              stroke="currentColor"
                              class="h-6 w-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div class="mt-8">
                        {isEmptySignal.value ? (
                          <StoreCartRows />
                        ) : (
                          <div class="flex items-center justify-center h-48 text-xl text-gray-400">
                            Your cart is empty
                          </div>
                        )}
                      </div>
                    </div>
                    {isEmptySignal.value && (
                      <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div class="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>
                            {formatPrice(
                              appStore.cart.totalPrice.amount,
                              appStore.cart.totalPrice.currencyCode
                            )}
                          </p>
                        </div>
                        <p class="mt-0.5 text-sm text-gray-500">
                          Shipping will be calculated at checkout.
                        </p>
                        <a target="_blank" href={appStore.cart.webUrl} class="button_primary mt-6">
                          Checkout
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
});