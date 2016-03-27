$(document).ready(function(){
  $('.social-feed-container').socialfeed({
    twitter:{
        accounts: ['@avrotroskunst', '#tussenkunstenkitsch', '#avrotroskunst'],
        limit: 2,
        consumer_key: 'TLaghYOTvlfKe7ConwtM2K67T',
        consumer_secret: 'lJHKBgt35RMIb5G208NVweLVtUsFFRKSdvypJSqifJ1WyIcDst',
     },
     instagram:{
        accounts: ['@tussenkunstenkitsch','#tussenkunstenkitsch', '#avrotroskunst'],
        limit: 2,
        client_id: '8d80736e9cd24e3eae6c5250244222cb',
        access_token: '3753276.1677ed0.3dd3b2a8cb084a46804d40b7abf61ea8'
    },
    facebook:{
        accounts: ['@tussenkunstenkitsch','#tussenkunstenkitsch', '#avrotroskunst'],
        limit: 2,
        access_token: '1673916596229855|a59d7523479cce40b42d1d34933dd567'
    },
    length:120
  });
});
