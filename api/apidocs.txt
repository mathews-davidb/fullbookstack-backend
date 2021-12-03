/*

/api/users/register

post - {email: email: password: password}

return - [{ id: 1, email: whatever@gmail.com, token: }]

-------------------------------------

/api/users/login

post - [{email: email: password: password}]

return - [{ id: 1, email: whatever@gmail.com, token: }]

----------------------------------------

/api/users/me

get 

return - [{ id: 1, email: whatever@gmail.com}]

----------------------------------------

/api/users/:userId/orders

get 

return - [{ id: 1, userId: , isPurchased:, [products]]

------------------------------------------

/api/products/

get

return - [{id: id, name: name, description: description, price: , stock:, category: }]

------------------------------------------------

/api/products/:category


-------------------------------------------------

/api/products/

post - [{id: , name: , desc: , price: , stock: , category: }]

return - [{id: , name: , desc: , price: , stock: , category: }]

---------------------------------------------------

/api/products/:productId

patch - [{id: , name: , desc: , price: , stock: , category: }]

return - [{id: , name: , desc: , price: , stock: , category: }]

---------------------------------------------------

/api/products/:productId

delete - [{id: , name: , desc: , price: , stock: , category: }]

---------------------------------------------------

/api/orders

post - [{id: , userId:, is_purchase: }]

return - [{id: , userId:, is_purchase: }]

---------------------------------------------------

/api/orders

patch - [{is_purchase: }]

return - [{id: , userId:, is_purchase: }]

---------------------------------------------------

/api/orders/:orderID/products

post - [{productId: , price: , quantity: }]

return - [{id: , orderId: , productId: , price: , quantity: }]

---------------------------------------------------

/api/orders/:id

get 

return - [{id: , userId:, is_purchase: , [products]}]


---------------------------------------------------

-----
---------------------------------------------------


----------------------------------------------------

/api/cart_items/:id

patch - [{ quantity: }]

return - [{id: , orderId: , productId: , price: , quantity:, }]

----------------------------------------------------

/api/cart_items/:id

delete



*/
