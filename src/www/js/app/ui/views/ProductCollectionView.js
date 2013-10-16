define(function(require) {

  var BaseCollectionView = require('app/ui/views/BaseCollectionView'),
      ProductDetailView = require('app/ui/views/ProductDetailView');

  /**
   * A collection of ProductDetailViews
   * @class app.ui.views.ProductCollectionView
   * @super app.ui.views.BaseCollectionView
   */
  var ProductCollectionView = BaseCollectionView.extend(function ProductCollectionView() {
    BaseCollectionView.apply(this, arguments);
    this.render();
  },{
    TView: ProductDetailView
  });

  return ProductCollectionView;

});