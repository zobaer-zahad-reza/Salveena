/**
 * Salveena — Order Collector
 * Receives order data from index.html and appends each order as a
 * new row in this spreadsheet, in an "Orders" tab, with date & time.
 *
 * Setup steps are in apps-script/SETUP.md
 */

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Orders');
  if (!sheet) {
    sheet = ss.insertSheet('Orders');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Order ID', 'Date', 'Time', 'Name', 'Phone', 'Address', 'Delivery Zone',
      'Items', 'Item Count', 'Subtotal', 'Discount', 'Delivery Charge', 'Total',
      'Payment Method', 'bKash Transaction ID', 'Note'
    ]);
    sheet.setFrozenRows(1);
  }

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.orderId || '',
    data.date || '',
    data.time || '',
    data.name || '',
    data.phone || '',
    data.address || '',
    data.zone || '',
    data.items || '',
    data.itemCount || 0,
    data.subtotal || 0,
    data.discount || 0,
    data.deliveryCharge || 0,
    data.total || 0,
    data.paymentMethod || '',
    data.trxId || '',
    data.note || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Salveena order endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
