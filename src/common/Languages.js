
/** @format */

import LocalizedStrings from 'react-native-localization';

const Languages = new LocalizedStrings({
  en: {
    Exit: 'Exit',
    ExitConfirm: 'Are you sure you want to exit this app',
    YES: 'YES',
    OK: 'OK',
    ViewMyOrders: 'View My Oders',
    CANCEL: 'CANCEL',
    Confirm: 'Confirm',

    // Scene's Titles
    Home: 'Home',
    Intro: 'Intro',
    Product: 'Product',
    Cart: 'Cart',
    WishList: 'WishList',
    InputPhone: 'Please input your phone',

    // Home
    products: 'products',
    
    // Categories
    Makeup: 'Makeup',
    Skincare: 'Skincare',
    Haircare: 'Haircare',
    flashSale: 'Flash Sale',
    brandFeature: 'Featured Brands',

    // TopBar
    ShowFilter: 'Sub Categories',
    HideFilter: 'Hide',
    Sort: 'Sort',
    textFilter: 'Recent',

    // Category
    ThereIsNoMore: 'There is no more product to show',

    // Product
    AddedtoCart: 'Added item to Cart',
    AddtoCart: 'Add to Cart',
    AddtoWishlist: 'Add to Wishlist',
    ProductVariations: 'Variations',
    NoVariation: "This product don't have any variation",
    AdditionalInformation: 'Description',
    NoProductDescription: 'No Product Description',
    ProductReviews: 'Reviews',
    NoReview: "This product don't have any reviews ...yet",
    BUYNOW: 'BUY NOW',
    ProductLimitWaring: "You can't add more than 10 product",
    EmptyProductAttribute: "This product don't have any attributes",
    ProductFeatures: 'Features',
    ErrorMessageRequest: "Can't get data from server",
    NoConnection: 'No internet connection',
    ProductRelated: 'You May Also Like',

    // Cart
    NoCartItem: 'There is no product in cart',
    Total: 'Total',
    EmptyCheckout: "Sorry, you can't check out an empty cart",
    RemoveCartItemConfirm: 'Remove this product from cart?',
    MyCart: 'Cart',
    Order: 'Order',
    ShoppingCart: 'Shopping Cart',
    ShoppingCartIsEmpty: 'Your Cart is Empty',
    Delivery: 'Delivery',
    AddProductToCart: 'Add a product to the shopping cart',
    TotalPrice: 'Total Price:',
    YourDeliveryInfo: 'Your delivery info:',
    ShopNow: 'Shop Now',
    YourChoice: 'Your wishlist:',
    YourSale: 'Your Sale:',
    SubtotalPrice: 'Subtotal Price:',
    BuyNow: 'Buy Now',
    Items: 'items',
    Item: 'item',
    ThankYou: 'Thank you',
    FinishOrderCOD: 'You can use to number of order to track shipping status',
    FinishOrder:
      'Thank you so much for your purchased, to check your delivery status please go to My Orders',
    NextStep: 'Next Step',
    ConfirmOrder: 'Confirm Order',
    RequireEnterAllFileds: 'Please enter all fields',
    Error: 'Error',
    InvalidEmail: 'Invalid email address',
    Finish: 'Finish',

    // Wishlist
    NoWishListItem: 'There is no item in wishlist',
    MoveAllToCart: 'Add all to cart',
    EmptyWishList: 'Empty wishlist',
    EmptyAddToCart: 'Sorry, the wishlist is empty',
    RemoveWishListItemConfirm: 'Remove this product from wishlist?',
    CleanAll: 'Clean All',

    // Sidemenu
    SignIn: 'Log In',
    SignOut: 'Log Out',
    GuestAccount: 'Guest Account',
    CantReactEmailError:
      "We can't reach your email address, please try other login method",
    NoEmailError: "Your account don't have valid email address",
    EmailIsNotVerifiedError:
      "Your email address is not verified, we can' trust you",
    Shop: 'Shop',
    News: 'News',
    Contact: 'Contact us',
    Setting: 'Setting',
    Login: 'Login',
    Logout: 'Logout',
    Category: 'Category',

    // Checkout
    Checkout: 'Checkout',
    ProceedPayment: 'Proceed Payment',
    Purchase: 'Purchase',
    CashOnDelivery: 'Cash on Delivery',
    Paypal: 'Paypal',
    Stripe: 'Stripe',
    CreditCard: 'Credit Card',
    PaymentMethod: 'Payment Method - Not select',
    PaymentMethodError: 'Please select your payment method',
    PayWithCoD: 'Your purchase will be pay when goods were delivered',
    PayWithPayPal: 'Your purchase will be pay with PayPal',
    PayWithStripe: 'Your purchase will be pay with Stripe',
    ApplyCoupon: 'Apply',
    CouponPlaceholder: 'COUPON CODE',
    APPLY: 'APPLY',
    Back: 'Back',
    CardNamePlaceholder: 'Name written on card',
    BackToHome: 'Back to Home',
    OrderCompleted: 'Your order was completed',
    OrderCanceled: 'Your order was canceled',
    OrderFailed: 'Something went wrong...',
    OrderCompletedDesc: 'Your order id is ',
    OrderCanceledDesc:
      'You have canceled the order. The transaction has not been completed',
    OrderFailedDesc:
      'We have encountered an error while processing your order. The transaction has not been completed. Please try again',
    OrderTip:
      'Tip: You could track your order status in "My Orders" section from side menu',
    Payment: 'Payment',
    Complete: 'Complete',
    EnterYourFirstName: 'Enter your First Name',
    EnterYourLastName: 'Enter your Last Name',
    EnterYourEmail: 'Enter your email',
    EnterYourPhone: 'Enter your phone',
    EnterYourAddress: 'Enter your address',
    CreateOrderError: 'Cannot create new order. Please try again later',
    AccountNumner: 'Account number',
    CardHolderName: 'Cardholder Name',
    ExpirationDate: 'Expiration Date',
    SecurityCode: 'CVV',

    // myorder
    OrderId: 'Order ID',
    MyOrder: 'My Orders',
    NoOrder: "You don't have any orders",
    OrderDate: 'Order Date: ',
    OrderStatus: 'Status: ',
    OrderPayment: 'Payment method: ',
    OrderTotal: 'Total: ',
    OrderDetails: 'Show detail',
    ShippingAddress: 'Shipping Address:',
    Refund: 'Refund',

    PostDetails: 'Post Details',
    FeatureArticles: 'Feature articles',
    MostViews: 'Most views',
    EditorChoice: 'Editor choice',

    // settings
    Settings: 'Settings',
    BASICSETTINGS: 'BASIC SETTINGS',
    Language: 'Language',
    INFO: 'INFO',
    About: 'About us',
    changeRTL: 'Switch RTL',

    // language
    AvailableLanguages: 'Available Languages',
    SwitchLanguage: 'Switch Language',
    SwitchLanguageConfirm: 'Switch language require an app reload, continue?',
    SwitchRtlConfirm: 'Switch RTL require an app reload, continue?',

    // about us
    AppName: 'MSTORE',
    AppDescription: 'React Native template for mCommerce',
    AppContact: ' Contact us at: mstore.io',
    AppEmail: ' Email: support@mstore.io',
    AppCopyRights: '© MSTORE 2016',

    // contact us
    contactus: 'Contact us',

    // form
    NotSelected: 'Not selected',
    EmptyError: 'This field is empty',
    DeliveryInfo: 'Delivery Info',
    FirstName: 'First Name',
    LastName: 'Last Name',
    Address: 'Address',
    City: 'Town/City',
    State: 'State',
    NotSelectedError: 'Please choose one',
    Postcode: 'Postcode',
    Country: 'Country',
    Email: 'Email',
    Phone: 'Phone Number',
    Note: 'Note',

    // search
    Search: 'Search',
    SearchPlaceHolder: 'Search product by name',
    NoResultError: 'Your search keyword did not match any products.',
    Details: 'Details',

    // filter panel
    Categories: 'Categories',

    // sign up
    profileDetail: 'Profile Details',
    firstName: 'First name',
    lastName: 'Last name',
    accountDetails: 'Account Details',
    username: 'Username',
    email: 'Email',
    generatePass: 'Use generate password',
    password: 'Password',
    signup: 'Sign Up',

    // filter panel
    Loading: 'LOADING...',
    welcomeBack: 'Welcome back! ',
    seeAll: 'Show All',

    // Layout
    cardView: 'Card ',
    simpleView: 'List View',
    twoColumnView: 'Two Column ',
    threeColumnView: 'Three Column ',
    listView: 'List View',
    default: 'Default',
    advanceView: 'Advance ',
    horizontal: 'Horizontal ',

    couponCodeIsExpired: 'This coupon code is expired',
    invalidCouponCode: 'This coupon code is invalid',
    remove: 'Remove',
    reload: 'Reload',
    applyCouponSuccess: 'Congratulations! Coupon code applied successfully ',
    applyCouponFailMin: `This minimum spend for this coupon is `,
    applyCouponFailMax: `This maximum spend for this coupon is `,

    OutOfStock: 'OUT OF STOCK',
    ShippingType: 'Shipping method',
    BrandFeature: 'Featured Brands',
    BrandFeatureSubtitle: 'Discover our trusted brands',

    // Place holder
    TypeFirstName: 'Type your first name',
    TypeLastName: 'Type your last name',
    TypeAddress: 'Type address',
    TypeCity: 'Type your town or city',
    TypeState: 'Type your state',
    TypeNotSelectedError: 'Please choose one',
    TypePostcode: 'Type postcode',
    TypeEmail: 'Type email (Ex. acb@gmail.com), ',
    TypePhone: 'Type your phone number',
    TypeNote: 'Note',
    TypeCountry: 'Select country',
    SelectPayment: 'Select Payment method',
    close: 'CLOSE',
    noConnection: 'NO INTERNET ACCESS',

    // user profile screen
    AccountInformations: 'Account Informations',
    PushNotification: 'Push notification',
    DarkTheme: 'Dark Theme',
    DeleteAccount: 'Delete Account',
    Privacy: 'Privacy policies',
    SelectCurrency: 'Select currency',
    Name: 'Name',
    Currency: 'Currency',
    Languages: 'Languages',

    GetDataError: "Can't get data from server",
    UserOrEmail: 'Username or email',
    Or: 'Or',
    FacebookLogin: 'Facebook Login',
    DontHaveAccount: "Don't have an account?",

    // Horizontal
    featureProducts: 'Feature Products',
    flashSale: 'Flash Sale',
    bagsCollections: 'Bags Collections',
    womanBestSeller: 'Woman Best Seller',
    manCollections: 'Man Collections',

    // Modal
    Select: 'Select',
    Cancel: 'Cancel',
    Guest: 'Guest',

    LanguageName: 'English',

    // review
    vendorTitle: 'Vendor',
    comment: 'Leave a review',
    yourcomment: 'Your comment',
    placeComment:
      'Tell something about your experience or leave a tip for others',
    writeReview: 'Review',
    thanksForReview:
      'Thanks for the review, your content will be verify by the admin and will be published later',
    errInputComment: 'Please input your content to submit',
    errRatingComment: 'Please rating to submit',
    send: 'Send',

    termCondition: 'Term & Condition',
    Subtotal: 'Subtotal',
    Discount: 'Discount',
    Shipping: 'Shipping',
    Taxes: 'Taxes',
    Recents: 'Recents',
    Filters: 'Filters',
    Princing: 'Pricing',
    Filter: 'Filter',
    ClearFilter: 'Clear Filter',
    ProductCatalog: 'Product Catalog',
    ProductTags: 'Product Tags',
    AddToAddress: 'Add to Address',
    SMSLogin: 'SMS Login',
    OrderNotes: 'Order Notes',

    CanNotLogin: 'Can not login, something was wrong!',
    PleaseCompleteForm: 'Please complete the form!',
    ServerNotResponse: "Server doesn't response correctly",
    CanNotRegister: "Can't register user, please try again.",

    UserProfile: 'User Profile',
    LoadMore: 'Load More',
    OrderSummary: 'Order Summary',
    OrderItems: 'Order Items',
    BillingAddress: 'Billing Address',
    ShippingAddress: 'Shipping Address',
    PriceSummary: 'Price Summary',
    ProceedToPayment: 'Proceed to Payment',
    PromotionCode: 'Promotion Code',
    ShippingMethods: 'Shipping Methods',
    LoadingShippingRates: 'Loading shipping rates...',
    NoShippingMethods: 'No shipping methods available',
    SelectShippingMethod: 'Select Shipping Method',
    ShippingCost: 'Shipping Cost',
    EstimatedDelivery: 'Estimated Delivery',
    
    // Payment Methods
    PaymentMethods: 'Payment Methods',
    SelectPaymentMethod: 'Select Payment Method',
    CreditCard: 'Credit Card',
    BankTransfer: 'Bank Transfer',
    EWallet: 'E-Wallet',
    ConvenienceStore: 'Convenience Store',
    QRIS: 'QRIS',
    GoPay: 'GoPay',
    ShopeePay: 'ShopeePay',
  },
  ar: {
    Exit: 'Keluar',
    ExitConfirm: 'Apakah Anda yakin ingin keluar dari aplikasi ini',
    YES: 'YA',
    OK: 'OK',
    ViewMyOrders: 'Lihat Pesanan Saya',
    CANCEL: 'BATAL',
    Confirm: 'Konfirmasi',

    // Scene's Titles
    Home: 'Beranda',
    Intro: 'Pengenalan',
    Product: 'Produk',
    Cart: 'Keranjang',
    WishList: 'Daftar Keinginan',

    // Home
    products: 'produk',
    
    // Categories
    Makeup: 'Makeup',
    Skincare: 'Skincare',
    Haircare: 'Haircare',
    flashSale: 'Flash Sale',
    brandFeature: 'Merek Unggulan',

    // TopBar
    ShowFilter: 'Sub Kategori',
    HideFilter: 'Sembunyikan',
    Sort: 'Urutkan',
    textFilter: 'Terbaru',

    // Category
    ThereIsNoMore: 'Tidak ada produk lagi untuk ditampilkan',

    // Product
    AddedtoCart: 'Item ditambahkan ke Keranjang',
    AddtoCart: 'Tambah ke Keranjang',
    AddtoWishlist: 'Tambah ke Daftar Keinginan',
    ProductVariations: 'Variasi',
    NoVariation: 'Produk ini tidak memiliki variasi',
    AdditionalInformation: 'Deskripsi',
    NoProductDescription: 'Tidak ada Deskripsi Produk',
    ProductReviews: 'Ulasan',
    NoReview: 'Produk ini belum memiliki ulasan',
    BUYNOW: 'BELI SEKARANG',
    ProductLimitWaring: 'Anda tidak dapat menambahkan lebih dari 10 produk',
    EmptyProductAttribute: 'Produk ini tidak memiliki atribut',
    ProductFeatures: 'Fitur',
    ErrorMessageRequest: 'Tidak dapat mengambil data dari server',
    NoConnection: 'Tidak ada koneksi internet',
    ProductRelated: 'Mungkin Anda juga suka',
    // Cart
    NoCartItem: 'Tidak ada produk di keranjang',
    Total: 'Total',
    EmptyCheckout: 'Maaf, tidak dapat melanjutkan dengan keranjang kosong',
    RemoveCartItemConfirm: 'Hapus produk ini dari keranjang belanja?',
    MyCart: 'Keranjang Saya',
    Order: 'Pesanan',
    ShoppingCart: 'Keranjang Belanja',
    ShoppingCartIsEmpty: 'Keranjang belanja kosong',
    Delivery: 'Pengiriman',
    AddProductToCart: 'Tambah produk ke keranjang',
    TotalPrice: 'Harga Total:',
    YourDeliveryInfo: 'Informasi Pengiriman Anda:',
    ShopNow: 'Belanja Sekarang',
    YourChoice: 'Keranjang Anda:',
    YourSale: 'Penjualan Anda:',
    SubtotalPrice: 'Harga Subtotal:',
    BuyNow: 'Beli Sekarang',
    Items: 'Item',
    Item: 'item',
    ThankYou: 'Terima kasih',
    FinishOrderCOD: 'Anda dapat menggunakan nomor ini untuk melacak pengiriman Anda',
    FinishOrder:
      'Terima kasih telah menyelesaikan pembelian, untuk memeriksa status pesanan silakan lihat pesanan saya',
    NextStep: 'Langkah Selanjutnya',
    ConfirmOrder: 'Konfirmasi Pesanan',
    RequireEnterAllFileds: 'Silakan isi semua field',
    Error: 'Error',
    InvalidEmail: 'Email tidak valid',
    Finish: 'Selesai',

    // Wishlist
    NoWishListItem: 'Tidak ada produk di daftar keinginan',
    MoveAllToCart: 'Tambah semua ke keranjang',
    EmptyWishList: 'Daftar kosong',
    EmptyAddToCart: 'Maaf, daftar keinginan kosong',
    RemoveWishListItemConfirm: 'Hapus produk ini dari daftar keinginan?',
    CleanAll: 'Hapus Semua',

    // Sidemenu
    SignIn: 'Masuk',
    SignOut: 'Keluar',
    GuestAccount: 'Tamu',
    CantReactEmailError: 'Email ini tidak ditemukan, coba metode login lain',
    NoEmailError: 'Email yang dimasukkan tidak valid',
    EmailIsNotVerifiedError:
      'Email Anda belum diverifikasi, akun Anda tidak akan diaktifkan',
    Shop: 'Toko',
    News: 'Berita',
    Contact: 'Hubungi Kami',
    Setting: 'Pengaturan',
    Login: 'Masuk',
    Logout: 'Keluar',
    Category: 'Kategori',

    // Checkout
    Checkout: 'Checkout',
    ProceedPayment: 'Lanjutkan Pembayaran',
    Purchase: 'Beli',
    CashOnDelivery: 'Bayar di Tempat',
    Paypal: 'PayPal',
    Stripe: 'Stripe',
    CreditCard: 'Kartu Kredit',
    PaymentMethod: 'Metode Pembayaran - Tidak ditentukan',
    PaymentMethodError: 'Silakan pilih metode pembayaran',
    PayWithCoD: 'Silakan pilih metode pembayaran',
    PayWithPayPal: 'Bayar dengan PayPal',
    PayWithStripe: 'Pembayaran akan diproses dengan Stripe',
    ApplyCoupon: 'Terapkan Kupon',
    CouponPlaceholder: 'Kode Kupon',
    APPLY: 'TERAPKAN',
    Back: 'Kembali',
    CardNamePlaceholder: 'Nama di kartu',
    BackToHome: 'Kembali ke Beranda',
    OrderCompleted: 'Pesanan Anda selesai',
    OrderCanceled: 'Pesanan Anda dibatalkan',
    OrderFailed: 'Pesanan Anda gagal',
    OrderCompletedDesc: 'ID pesanan Anda adalah ',
    OrderCanceledDesc: 'Pesanan dibatalkan sesuai permintaan Anda',
    OrderFailedDesc: 'Terjadi kesalahan dan pembelian tidak dapat diselesaikan',
    OrderTip:
      'Tips: Anda dapat melacak status pesanan di bagian "Pesanan Saya" dari menu samping',
    Payment: 'Pembayaran',
    Complete: 'Selesai...',
    EnterYourFirstName: 'Masukkan nama depan Anda',
    EnterYourLastName: 'Masukkan nama belakang Anda',
    EnterYourEmail: 'Masukkan email Anda',
    EnterYourPhone: 'Masukkan nomor telepon Anda',
    EnterYourAddress: 'Masukkan alamat Anda',
    CreateOrderError: 'Masukkan alamat Anda...',
    AccountNumner: 'Nomor Rekening',
    CardHolderName: 'Nama Pemegang Kartu',
    ExpirationDate: 'Tanggal Kedaluwarsa',
    SecurityCode: 'CVV',

    // myorder
    OrderId: 'ID Pesanan',
    MyOrder: 'Pesanan Saya',
    NoOrder: 'Tidak ada pesanan',
    OrderDate: 'Tanggal Pesanan: ',
    OrderStatus: 'Status: ',
    OrderPayment: 'Metode Pembayaran: ',
    OrderTotal: 'Total: ',
    OrderDetails: 'Tampilkan Detail',
    ShippingAddress: 'Alamat Pengiriman:',
    Refund: 'Pengembalian',

    PostDetails: 'Baca Selengkapnya',
    FeatureArticles: 'Artikel',
    MostViews: 'Paling Banyak Dilihat',
    EditorChoice: 'Pilihan Editor',

    // settings
    Settings: 'Pengaturan',
    BASICSETTINGS: 'Pengaturan Dasar',
    Language: 'Bahasa',
    INFO: 'Informasi',
    About: 'Tentang Kami',
    changeRTL: 'Ubah Arah',

    // language
    AvailableLanguages: 'Bahasa yang Tersedia',
    SwitchLanguage: 'Ganti Bahasa',
    SwitchLanguageConfirm:
      'Untuk mengganti bahasa, aplikasi akan dimuat ulang, apakah Anda ingin melanjutkan?',
    SwitchRtlConfirm:
      'Untuk mengubah arah aplikasi, aplikasi akan dimuat ulang, apakah Anda ingin melanjutkan?',

    // about us
    AppName: 'MSTORE',
    AppDescription: 'Template asli untuk WooCommerce',
    AppContact: 'Hubungi kami di: mstore.io',
    AppEmail: 'Email: support@mstore.io',
    AppCopyRights: '© MSTORE 2016',

    // contact us
    contactus: 'Hubungi Kami',

    // form
    NotSelected: 'Silakan pilih',
    EmptyError: 'Isi field ini',
    DeliveryInfo: 'Informasi Pengiriman',
    FirstName: 'Nama Depan',
    LastName: 'Nama Belakang',
    Address: 'Alamat',
    City: 'Kota',
    State: 'Provinsi',
    NotSelectedError: 'Pilih salah satu',
    Postcode: 'Kode Pos',
    Country: 'Negara',
    Email: 'Email',
    Phone: 'Nomor Telepon',
    Note: 'Catatan',

    // search
    Search: 'Cari',
    SearchPlaceHolder: 'Cari produk berdasarkan nama',
    NoResultError: 'Maaf, tidak ada hasil pencarian untuk kata kunci yang digunakan',
    Details: 'Detail',

    // filter panel
    Categories: 'Kategori',

    // sign up
    profileDetail: 'Detail Profil',
    firstName: 'Nama Depan',
    lastName: 'Nama Belakang',
    accountDetails: 'Detail Akun',
    username: 'Nama Pengguna',
    email: 'Email',
    generatePass: 'Buatkan kata sandi untuk saya',
    password: 'Kata Sandi',
    signup: 'Daftar',

    // filter panel
    Loading: 'Memuat...',
    welcomeBack: 'Selamat datang kembali! ',
    seeAll: 'Lihat Semua',

    // Layout
    cardView: 'Kartu',
    simpleView: 'Daftar Sederhana',
    twoColumnView: 'Dua Kolom',
    threeColumnView: 'Tiga Kolom',
    listView: 'Daftar Vertikal',
    default: 'Default',
    advanceView: 'Gaya Lanjutan',
    horizontal: 'Horizontal',

    couponCodeIsExpired: 'Kupon ini sudah tidak berlaku',
    invalidCouponCode: 'Kupon ini tidak valid',
    remove: 'Hapus',
    applyCouponSuccess: 'Selamat! Kupon berhasil diterapkan',
    reload: 'Muat Ulang',

    OutOfStock: 'Stok Habis',
    ShippingType: 'Jenis Pengiriman',
    BrandFeature: 'Merek Unggulan',
    BrandFeatureSubtitle: 'Temukan merek terpercaya kami',

    // Place holder
    TypeFirstName: 'Ketik nama depan Anda',
    TypeLastName: 'Ketik nama belakang Anda',
    TypeAddress: 'Ketik alamat',
    TypeCity: 'Ketik kota Anda',
    TypeState: 'Ketik provinsi atau kota',
    TypeNotSelectedError: 'Pilih salah satu',
    TypePostcode: 'Ketik kode pos',
    TypeEmail: 'Ketik email yang valid seperti email@email.com: ',
    TypePhone: 'Ketik nomor telepon Anda',
    TypeNote: 'Catatan',
    TypeCountry: 'Pilih negara Anda',
    SelectPayment: 'Pilih metode pembayaran',
    close: 'Tutup',
    noConnection: 'Tidak ada koneksi internet',

    // user profile screen
    AccountInformations: 'Informasi Akun',
    PushNotification: 'Notifikasi',
    DarkTheme: 'Tema Gelap',
    DeleteAccount: 'Hapus Akun',
    Privacy: 'Kebijakan Privasi',
    SelectCurrency: 'Pilih Mata Uang',
    Name: 'Nama',
    Currency: 'Mata Uang',
    Languages: 'Bahasa',

    GetDataError: 'Tidak dapat terhubung ke server',
    UserOrEmail: 'Nama pengguna atau email',
    Or: 'atau',
    FacebookLogin: 'Masuk dengan Facebook',
    DontHaveAccount: 'Tidak punya akun?',

    // Horizontal
    featureProducts: 'Produk Unggulan',
    flashSale: 'Flash Sale',
    bagsCollections: 'Koleksi Tas',
    womanBestSeller: 'Produk Wanita Terlaris',
    manCollections: 'Koleksi Pria',

    // Modal
    Select: 'Pilih',
    Cancel: 'Batal',
    Guest: 'Tamu',

    LanguageName: 'Indonesia',

    // review
    vendorTitle: 'Penjual',
    comment: 'Tinggalkan Komentar',
    yourcomment: 'Komentar Anda',
    placeComment: 'Ceritakan pengalaman Anda atau berikan saran untuk orang lain',
    writeReview: 'Tulis Ulasan',
    thanksForReview:
      'Terima kasih atas ulasannya, konten Anda akan diperiksa oleh admin dan akan dipublikasikan nanti',
    errInputComment: 'Silakan masukkan konten Anda untuk mengirim',
    errRatingComment: 'Silakan beri rating untuk mengirim',
    send: 'Kirim',

    termCondition: 'Syarat dan Ketentuan',
    Subtotal: 'Subtotal',
    Discount: 'Diskon',
    Shipping: 'Pengiriman',
    Taxes: 'Pajak',
    Recents: 'Terbaru',
    Filters: 'Filter',
    Princing: 'Harga',
    Filter: 'Filter',
    ClearFilter: 'Hapus Filter',
    ProductCatalog: 'Katalog Produk',
    ProductTags: 'Tag Produk',
    AddToAddress: 'Tambah ke Alamat',
    SMSLogin: 'Masuk dengan SMS',
    OrderNotes: 'Catatan Pesanan',

    CanNotLogin: 'Tidak dapat masuk, terjadi kesalahan!',
    PleaseCompleteForm: 'Silakan lengkapi formulir!',
    ServerNotResponse: 'Server tidak merespons dengan benar',
    CanNotRegister: 'Tidak dapat mendaftarkan pengguna, silakan coba lagi.',

    UserProfile: 'Profil Pengguna',
    LoadMore: 'Muat Lebih Banyak',
    OrderSummary: 'Ringkasan Pesanan',
    OrderItems: 'Item Pesanan',
    BillingAddress: 'Alamat Penagihan',
    ShippingAddress: 'Alamat Pengiriman',
    PriceSummary: 'Ringkasan Harga',
    ProceedToPayment: 'Lanjutkan Pembayaran',
    PromotionCode: 'Kode Promosi',
    ShippingMethods: 'Metode Pengiriman',
    LoadingShippingRates: 'Memuat tarif pengiriman...',
    NoShippingMethods: 'Tidak ada metode pengiriman tersedia',
    SelectShippingMethod: 'Pilih Metode Pengiriman',
    ShippingCost: 'Biaya Pengiriman',
    EstimatedDelivery: 'Estimasi Pengiriman',
    
    // Payment Methods
    PaymentMethods: 'Metode Pembayaran',
    SelectPaymentMethod: 'Pilih Metode Pembayaran',
    CreditCard: 'Kartu Kredit',
    BankTransfer: 'Transfer Bank',
    EWallet: 'E-Wallet',
    ConvenienceStore: 'Minimarket',
    QRIS: 'QRIS',
    GoPay: 'GoPay',
    ShopeePay: 'ShopeePay',
  },
});

// Add method to get available languages
Languages.getAvailableLanguages = () => ['en', 'ar'];

export default Languages;
