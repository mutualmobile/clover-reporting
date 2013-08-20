define(function(require) {

  var CollectionView = require('app/ui/views/CollectionView'),
      ProductDetailView = require('app/ui/views/ProductDetailView');

  /**
   * A collection of ProductDetailViews
   * @class app.ui.views.ProductCollectionView
   * @super app.ui.views.CollectionView
   */
  var ProductCollectionView = CollectionView.extend(function ProductCollectionView() {
    CollectionView.apply(this, arguments);
    this.render();
  },{
    TView: ProductDetailView
  });

  return ProductCollectionView;

});