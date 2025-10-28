import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Color, Fonts} from '@common';

const PaymentDetails = ({order, theme}) => {
  // Extract payment details from order meta_data
  const getPaymentMeta = (key) => {
    if (!order.meta_data) return null;
    const meta = order.meta_data.find(item => item.key === key);
    return meta ? meta.value : null;
  };

  const paymentMethod = getPaymentMeta('_midtrans_payment_method') || order.payment_method_title || 'Unknown';
  const vaNumber = getPaymentMeta('_midtrans_va_number');
  const paymentStatus = getPaymentMeta('_midtrans_payment_status');
  const transactionId = getPaymentMeta('_midtrans_transaction_id');
  const isDemo = getPaymentMeta('_midtrans_is_demo') === 'yes';

  // Determine payment method display name
  const getPaymentMethodName = (method) => {
    const methodMap = {
      'bank_transfer_bca': 'Bank Transfer - BCA',
      'bank_transfer_bni': 'Bank Transfer - BNI', 
      'bank_transfer_bri': 'Bank Transfer - BRI',
      'bank_transfer_mandiri': 'Bank Transfer - Mandiri',
      'gopay': 'GoPay',
      'shopeepay': 'ShopeePay',
      'dana': 'DANA',
      'ovo': 'OVO',
      'linkaja': 'LinkAja',
      'snap': 'Midtrans Snap',
      'snap_demo': 'Midtrans Snap (Demo)'
    };
    return methodMap[method] || method || 'Unknown Payment Method';
  };

  // Get payment status display
  const getPaymentStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Menunggu Pembayaran',
      'settlement': 'Pembayaran Berhasil',
      'expire': 'Pembayaran Kedaluwarsa',
      'cancel': 'Pembayaran Dibatalkan',
      'deny': 'Pembayaran Ditolak'
    };
    return statusMap[status] || status || 'Unknown Status';
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    const colorMap = {
      'pending': '#FF6B35',
      'settlement': '#4CAF50',
      'expire': '#F44336',
      'cancel': '#F44336',
      'deny': '#F44336'
    };
    return colorMap[status] || '#666666';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        Payment Details
      </Text>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, {color: theme.colors.text}]}>
          Payment Method:
        </Text>
        <Text style={[styles.value, {color: theme.colors.text}]}>
          {getPaymentMethodName(paymentMethod)}
        </Text>
      </View>

      {isDemo && (
        <View style={styles.demoWarning}>
          <Text style={[styles.demoText, {color: '#FF6B35'}]}>
            ⚠️ Demo Payment Mode
          </Text>
        </View>
      )}

      {vaNumber && (
        <View style={styles.detailRow}>
          <Text style={[styles.label, {color: theme.colors.text}]}>
            Virtual Account:
          </Text>
          <Text style={[styles.value, {color: theme.colors.text, fontFamily: Fonts.regular}]}>
            {vaNumber}
          </Text>
        </View>
      )}

      {transactionId && (
        <View style={styles.detailRow}>
          <Text style={[styles.label, {color: theme.colors.text}]}>
            Transaction ID:
          </Text>
          <Text style={[styles.value, {color: theme.colors.text, fontFamily: Fonts.regular}]}>
            {transactionId}
          </Text>
        </View>
      )}

      {paymentStatus && (
        <View style={styles.detailRow}>
          <Text style={[styles.label, {color: theme.colors.text}]}>
            Payment Status:
          </Text>
          <Text style={[styles.value, {color: getPaymentStatusColor(paymentStatus), fontWeight: 'bold'}]}>
            {getPaymentStatusDisplay(paymentStatus)}
          </Text>
        </View>
      )}

      {paymentMethod.includes('bank_transfer') && (
        <View style={styles.instructionBox}>
          <Text style={[styles.instructionTitle, {color: theme.colors.text}]}>
            Payment Instructions:
          </Text>
          <Text style={[styles.instructionText, {color: theme.colors.text}]}>
            1. Transfer ke Virtual Account di atas{'\n'}
            2. Gunakan nominal yang tepat{'\n'}
            3. Pembayaran akan otomatis terverifikasi{'\n'}
            4. Order akan berubah status menjadi "Processing"
          </Text>
        </View>
      )}

      {paymentMethod === 'gopay' && (
        <View style={styles.instructionBox}>
          <Text style={[styles.instructionTitle, {color: theme.colors.text}]}>
            Payment Instructions:
          </Text>
          <Text style={[styles.instructionText, {color: theme.colors.text}]}>
            1. Buka aplikasi GoPay{'\n'}
            2. Scan QR code atau masukkan kode pembayaran{'\n'}
            3. Konfirmasi pembayaran{'\n'}
            4. Order akan otomatis terverifikasi
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    marginBottom: 10,
    color: Color.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    flex: 2,
    textAlign: 'right',
  },
  demoWarning: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 4,
    marginVertical: 5,
  },
  demoText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  instructionBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  instructionTitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
});

export default PaymentDetails;
