define(function(require) {

  var BasePageView = require('./BasePageView'),
      ProductCollectionView = require('app/ui/views/ProductCollectionView'),
      productCollection = require('app/models/ProductCollection');

  require('rdust!templates/products');

  /**
   * Product View
   * @class app.ui.pageviews.ProductsView
   * @extends app.ui.pageviews.BasePageView
   */
  var ProductsView = BasePageView.extend(function() {
    BasePageView.apply(this, arguments);
    this.mapChildView({
      '.product-list': {
        TView: ProductCollectionView,
        model: productCollection
      }
    });
  }, {
    template: 'templates/products',
    className: 'details'
  });

  return ProductsView;

});