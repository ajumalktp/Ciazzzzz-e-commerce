

function addToCart(prodID){
    $.ajax({
      url:'/add-to-cart/'+prodID,
      method:'get',
      success:(response)=>{
        if(response.change){
          totalPrice()
            if(response.status){
              let count = $('.badge').html()
              count= parseInt(count)+1
              $('.badge').html(count)
            }
        }
      }
    })
  }

  function changeQuantity(cartID,prod_id,prodID,count,price){
    $.ajax({
      url:'/changeQuantity',
      method:'post',
      data:{
        cartID:cartID,
        prod_id:prod_id,
        prodID:prodID,
        count:count
      },
      success:(response)=>{
        if(response.status){
          $(`#${prodID}`).val(response.quantity)
          changePrice(cartID,prod_id,prodID,response.quantity,price)
          totalPrice()
          if(response.quantity<=0){
            removeItem(prod_id)
          }
        }
      }
    })
  }

  function changePrice(cartID,prod_id,prodID,quantity,price){
    $.ajax({
      url:'/changePrice',
      method:'post',
      data:{
        cartID:cartID,
        prod_id:prod_id,
        prodID:prodID,
        price:price,
        quantity:quantity
      },
      success:(response)=>{
        if(response.status){
          $(`#${prodID}price`).text(response.updatedPrice)
          totalPrice
        }
      }
    })
  }

  function removeItem(prod_id){
    $.ajax({
      url:'/removeItem',
      method:'post',
      data:{
        prod_id:prod_id,
      },
      success:(response)=>{
        if(response.status)
        $(`#${prod_id}`).remove()
        $('.items').text(response.items+' items')
        totalPrice()
        if (response.items === 0) {
          loadEmptyCartContent();
        }
      }
    })
  }

  function loadEmptyCartContent() {
    $.ajax({
      url: '/emptyCart',
      method: 'GET',
      success: (content)=> {
        $('#itemsSection').css('display', 'none')
        $('#emptyCartContainer').html(content);
      },
    });
  }

  function totalPrice(){
    $.ajax({
      url:'/get-totalPrice',
      method:'post',
      success:(response)=>{
        if(response.status){
          $('.totalPrice').text(response.totalPrice)
        }
      }
    })
  }

  function dummyButton(){
    let pop = document.getElementById('pop')
      pop.style.display = 'block'
    }


    $('#checkout-form').submit((e)=>{
      e.preventDefault()
      $.ajax({
        url:'/place_order',
        method:'post',
        data:$('#checkout-form').serialize(),
        success:(response)=>{
          if(!response){
            alert("Order placed successfully")
            location.href = '/'
          }else{
            RazorpayPayment(response)
          }
        }
        })
    })

    function RazorpayPayment(order){
      var options = {
        "key": "rzp_test_8x3pXYP4r0mdbq", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Ciazzzzz",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {

          verifyPayment(response, order)
        },
        "prefill": {
          "name": "Muhammed Ajumal T",
          "email": "ajumalktp555@gmail.com",
          "contact": "9605714367"
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#3399cc"
        }
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
    }