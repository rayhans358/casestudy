const { AbilityBuilder, Ability } = require("@casl/ability");

// policy
const accessControl = {
  guest (user, {can}) {
    can('read', 'Product')
  },
  user(user, {can}) {
    can('create', 'Bank', {user_id: user._id});
    can('update', 'Bank', {user_id: user._id});
    can('delete', 'Bank', {user_id: user._id});
    can('create', 'MiniMarket', {user_id: user._id});
    can('update', 'MiniMarket', {user_id: user._id});
    can('delete', 'MiniMarket', {user_id: user._id});
    can('read', 'Product');
    can('create', 'Product', {user_id: user._id});
    can('update', 'Product', {user_id: user._id});
    can('delete', 'Product', {user_id: user._id});
    can('view', 'Category');
    can('create', 'Category', {user_id: user._id});
    can('update', 'Category', {user_id: user._id});
    can('delete', 'Category', {user_id: user._id});
    can('view', 'Tag');
    can('create', 'Tag', {user_id: user._id});
    can('update', 'Tag', {user_id: user._id});
    can('delete', 'Tag', {user_id: user._id});
    can('view', 'Order');
    can('create', 'Order', {user_id: user._id});
    can('read', 'Order', {user_id: user._id});
    can('update', 'User', {_id: user._id});
    can('read', 'Cart', {user_id: user._id});
    can('update', 'Cart', {user_id: user._id});
    can('view', 'DeliveryAddress', {user_id: user._id});
    can('create', 'DeliveryAddress', {user_id: user._id});
    can('update', 'DeliveryAddress', {user_id: user._id});
    can('delete', 'DeliveryAddress', {user_id: user._id});
    can('read', 'Invoice', {user_id: user._id});
  },
  admin(user, {can}) {
    can('manage', 'all');
  }
}

const policyFor = user => {
  let builder = new AbilityBuilder();
  if (user && typeof accessControl[user.role] === 'function') {
    accessControl[user.role](user, builder);
  } else {
    accessControl['guest'](user, builder);
  }
  return new Ability(builder.rules)
}

module.exports = {
  policyFor
}