const { AbilityBuilder, Ability } = require("@casl/ability");

// policy
const accessControl = {
  guest (user, {can}) {
    can('read', 'Product')
  },
  user(user, {can}) {
    can('view', 'Order');
    can('create', 'Order');
    can('read', 'Order', {user_id: user._id});
    can('update', 'User', {_id: user._id});
    can('read', 'Cart', {user_id: user._id});
    can('update', 'Cart', {user_id: user._id});
    can('view', 'DeliveryAddress');
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