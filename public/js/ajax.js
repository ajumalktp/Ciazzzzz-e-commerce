

function addToCart(prodID){
    $.ajax({
      url:'/add-to-cart/'+prodID,
      method:'get',
      success:(response)=>{
        if(response.status){
            let count = $('.badge').html()
            count= parseInt(count)+1
            $('.badge').html(count)
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