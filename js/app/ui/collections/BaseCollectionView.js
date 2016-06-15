define(function(require) {
  var View = require('lavaca/mvc/View');
  var BaseView = require('app/ui/BaseView');
  var Promise = require('lavaca/util/Promise');
  var clone = require('mout/lang/clone');
  var $ = require('$');

  var _UNDEFINED;

  /**
   * A view for synchronizing a collection of models with sub views
   * @class app.ui.collections.BaseCollectionView
   * @super app.ui.BaseView
   */
  var BaseCollectionView = BaseView.extend(function BaseCollectionView() {
    // Call the super class' constructor
    BaseView.apply(this, arguments);
    this.el.empty();
    this.collectionViews = [];
    this.mapEvent({
      model: {
        'addItem': this.onItemEvent.bind(this),
        'moveItem': this.onItemEvent.bind(this),
        'removeItem': this.onItemEvent.bind(this),
        'changeItem': this.onItemEvent.bind(this)
      }
    });
  },{
    /**
     * A class name added to the view container
     * @property className
     * @type String
     */
    className: 'collection-view',
    /**
     * A function that should return a jQuery element
     * that will be used as the `el` for a particular
     * item in the collection. The function is passed
     * two parameters, the model and the index.
     * @property itemEl
     * @type jQuery
     */
    itemEl: function(model, index) {
      return $('<div/>');
    },
    /**
     * The view type used for each item view
     * @property TView
     * @type lavaca.mvc.View
     */
    TView: View,
    /**
     * Initializes and renders all item views to be shown
     * @method render
     */
    render: function() {
      var models = this.model.filter(this.modelFilter.bind(this)),
          fragment = document.createDocumentFragment(),
          view;
      models.forEach(function(item) {
        view = this.addItemView(item);
        fragment.appendChild(view.el[0]);
      }.bind(this));
      this.trigger('rendersuccess', {html: fragment});
      return new Promise().resolve();
    },
    /**
     * Creates a new view and inserts it into the DOM at the
     * provided index
     * @method addItemView
     * @param {Object} [model] the model for the view
     * @param {Number} [index] the index to insert the view in the DOM
     */
    addItemView: function(model, index) {
      var count = this.collectionViews.length,
          insertIndex = index === null || index === _UNDEFINED ? count : index,
          view;

      if (insertIndex < 0 || insertIndex > count) {
        throw 'Invalid item view insertion index';
      }
      view = new this.TView(this.itemEl(model, index), model, this);
      this.childViews.set(view.id, view);
      this.collectionViews.splice(insertIndex, 0, view);
      this.applyChildViewEvent(view);
      if (insertIndex === 0) {
        this.el.prepend(view.el[0]);
      } else if (insertIndex === count) {
        this.el.append(view.el[0]);
      } else {
        this.el
          .children()
          .eq(insertIndex-1)
          .after(view.el[0]);
      }
      if (view.autoRender) {
        view.render();
      }
      return view;
    },
    /**
     * adds listeners for a specific child view 
     * @method applyChildViewEvent
     * @param {Object} [view] the view to add listeners to
     */
    applyChildViewEvent: function(view) {
      var childViewEventMap = this.childViewEventMap,
          type;
      for (type in childViewEventMap) {
        if (view instanceof childViewEventMap[type].TView) {
          view.on(type, childViewEventMap[type].callback);
        }
      }
    },
    /**
     * Remove and disposes a view
     * @method removeItemView
     * @param {Number} [index] the index of the view to remove
     */
    removeItemView: function(index) {
      var view = this.collectionViews.splice(index, 1)[0];
      this.childViews.remove(view.id);
      view.dispose();
      view.el.remove();
    },
    /**
     * Returns the index of a view
     * @method getViewIndexByModel
     * @param {Object} [model] the model of the view to find
     */
    getViewIndexByModel: function(model) {
      var collectionViewIndex = -1;
      this.collectionViews.every(function(view, i) {
        if (view.model === model) {
          collectionViewIndex = i;
          return false;
        }
        return true;
      });
      return collectionViewIndex;
    },
    /**
     * The filter to run against the collection
     * @method modelFilter
     * @param {Number} [i] the index
     * @param {Object} [model] the model
     */
    modelFilter: function() {
      return true;
    },
    /**
     * Event handler for all collection events that produces all add, remove, and move actions
     * @method modelFilter
     * @param {Obejct} [e] the event
     */
    onItemEvent: function() {
      var models = this.model.filter(this.modelFilter.bind(this)),
          i = -1,
          model,
          view,
          viewIndex,
          oldIndex,
          modelIndex,
          temp;
      // Add new views
      while ((model = models[++i])) {
        viewIndex = this.getViewIndexByModel(model);
        if (viewIndex === -1) {
          this.addItemView(model, i);
        }
      }
      // Remove Old Views
      var collectionViews = clone(this.collectionViews);
      i = collectionViews.length;
      while ((view = collectionViews[--i])) {
        modelIndex = models.indexOf(view.model);
        if (modelIndex === -1) {
          this.removeItemView(i);
        }
      }
      // Move any existing views
      i = -1;
      while ((model = models[++i])) {
        oldIndex = this.getViewIndexByModel(model);
        if (oldIndex !== i) {
          this.swapViews(this.collectionViews[i], this.collectionViews[oldIndex]);
          temp = this.collectionViews[oldIndex];
          this.collectionViews[oldIndex] = this.collectionViews[i];
          this.collectionViews[i] = temp;
        }
      }
    },
    /**
     * Swaps two views in the DOM
     * @method swapViews
     * @param {Obejct} [viewA] a view
     * @param {Obejct} [viewB] another view
     */
    swapViews: function(viewA, viewB) {
      var a = viewA.el[0],
          b = viewB.el[0],
          aParent = a.parentNode,
          aSibling = a.nextSibling === b ? a : a.nextSibling;
        b.parentNode.insertBefore(a, b);
        aParent.insertBefore(b, aSibling);
    }

  });

  return BaseCollectionView;

});