import React, {useEffect, useState} from "react";
import "./PlansScreen.css"
import db from "../firebase";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

const PlansScreen = () => {
  const [products, setProducts] = useState([])
  const [subscription, setSubscription] = useState(null)
  const user = useSelector(selectUser)

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async subscription => {
          setSubscription({
            role: `${subscription.data().role} Plan`,
            current_period_end: subscription.data().current_period_end.seconds,
            current_period_start: subscription.data().current_period_start.seconds
          })
        })
      })
  }, [user.uid])

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data()
            }
          })
        })
        setProducts(products)
      })
  }, []);

  // console.log(products)
  console.log(subscription)

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        // show an error to your customer and
        // inspect your cloud function logs in the firebase console.
        alert(`An error occurred: ${error.message}`);
      }

      if (sessionId) {
        //  We have a session, let's redirect to Checkout Init Stripe

        const stripe = await loadStripe(
          "pk_test_51KaV42E746lR2qOv8geN3IgGgW1PPppHB42ON1oQ4dpKxBdvbUpUFdcG0rn7HzgIVjlzcGQwM1T5YER0AKxxtckT00fgJdwM9N",
        );
        await stripe.redirectToCheckout({sessionId});
      }
    })
  }

  return (
    <div className="plansScreen">
      <br/>
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}</p>}

      {Object.entries(products).map(([productId, productData]) => {
        // add some logic to check if the user's subscription is active...
        const isCurrentPackage = productData.name?.includes(subscription?.role)

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "plansScreen__plan--disabled"
            } plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PlansScreen