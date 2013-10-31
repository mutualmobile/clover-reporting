define(function(require) {

  var BaseCollectionView = require('app/ui/collections/BaseCollectionView'),
      ProductDetailView = require('app/ui/collections/detail/ProductCollectionDetailView');

  /**
   * A collection of ProductDetailViews
   * @class app.ui.collections.ProductCollectionView
   * @super app.ui.collections.BaseCollectionView
   */
  var ProductCollectionView = BaseCollectionView.extend(function ProductCollectionView() {
    BaseCollectionView.apply(this, arguments);
    this.render();
  },{
    TView: ProductDetailView
  });

  return ProductCollectionView;

});