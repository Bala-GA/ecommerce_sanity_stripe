const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
   if (req.method === 'POST') {
   let name = req.body.cartItems.map((item )=> item.name);
   console.log(name);
    try {
        const params = {
            submit_type:'pay',
            mode:'payment',
            payment_method_types:['card'],
            billing_address_collection:'auto',
            shipping_options:[
                {shipping_rate:'shr_1MjFlCSDJf5P75yQ3GwTIlUo'},
                //{shipping_rate:'shr_1Mj0eJSDJf5P75yQ5EB9ArGK'}
            ],
            line_items: req.body.cartItems.map((item) => {
              const img = item.image[0].asset._ref;
              //  console.log(img);
              const newImage = img.replace('image-', 'https://cdn.sanity.io/images/sajn6qt4/production/').replace('-webp', '.webp');

              // console.log('Image',newImage)
              return{
                price_data:{
                  currency: 'INR',
                  product_data:{
                    name:item.name,
                    images:[newImage],
                  },
                  unit_amount: item.price*100,
                },
                adjustable_quantity:{
                  enabled:true,
                  minimum:1,
                },
                quantity: item.quantity
              }
            }),
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/canceled`,
        }
         // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create(params);
        //res.redirect(303, session.url);
        res.status(200).json(session);
    } 
    catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}


// import Stripe from 'stripe'; 
// const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

// export default async function handler(req,res){
//     if(req.method === 'POST'){
//         try{

//         }
//         catch(error){
//             res.status(500).json({statusCode:500, message:error.message})
//         }
//     }
// }