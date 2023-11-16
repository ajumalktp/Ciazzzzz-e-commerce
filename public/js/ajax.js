

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


  function placeOrder(){
      const form = document.getElementById('checkout-form')
      const formData = new FormData(form);
        const formObject = {};
        
        formData.forEach(function(value, key){
            formObject[key] = value;
        });
        if(formObject.paymentMethod==='COD'){
          $.ajax({
        url:'/COD_order',
        method:'post',
        data:$('#checkout-form').serialize(),
        success:(response)=>{
          alert("Order placed successfully")
          location.href = '/'
        }
        })
        }else{
          $.ajax({
            url:'/ONLINE_order',
            method:'post',
            data:$('#checkout-form').serialize(),
            success:(response)=>{
              alert(response)
            }
            })
        }
    }