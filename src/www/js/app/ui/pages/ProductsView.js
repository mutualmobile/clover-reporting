define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      ProductCollectionView = require('app/ui/collections/ProductCollectionView'),
      ProductsCollection = require('app/models/collection/ProductsCollection');

  require('rdust!templates/detail_list');

  /**
   * Product View
   * @class app.ui.pages.ProductsView
   * @extends app.ui.BaseView
   */
  var ProductsView = BaseView.extend(function ProductsView() {
    BaseView.apply(this, arguments);
    this.mapChildView({
      '.list': {
        TView: ProductCollectionView,
        model: new ProductsCollection()
      }
    });
  }, {
    template: 'templates/detail_list',
    className: 'details'
  });

  return ProductsView;

});