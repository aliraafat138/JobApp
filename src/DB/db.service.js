export const create = async ({model, data = {}} = {}) => {
  const document = await model.create(data);
  return document;
};

export const find = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  skip = 0,
  limit = 1000,
} = {}) => {
  const document = await model
    .find(filter)
    .select(select)
    .populate(populate)
    .limit(limit);
  return document;
};

export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  const document = await model
    .findOne(filter)
    .select(select)
    .populate(populate);
  return document;
};
export const findById = async ({
  model,
  id = "",
  select = "",
  populate = [],
} = {}) => {
  const document = await model.findById(id).select(select).populate(populate);
  return document;
};

export const findByIdAndUpdate = async ({
  model,
  id = "",
  data = {},
  options = {},
  select = "",
  populate = [],
} = {}) => {
  const document = await model
    .findByIdAndUpdate(id, data, options)
    .select(select)
    .populate(populate);
  return document;
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  data = {},
  options = {},
  select = "",
  populate = [],
} = {}) => {
  const document = await model
    .findOneAndUpdate(filter, data, options)
    .select(select)
    .populate(populate);
  return document;
};

export const UpdateOne = async ({
  model,
  filter = {},
  data = {},
  options = {},
} = {}) => {
  const document = await model.updateOne(filter, data, options);
  return document;
};

export const UpdateMany = async ({
  model,
  filter = {},
  data = {},
  options = {},
} = {}) => {
  const document = await model.UpdateMany(filter, data, options);
  return document;
};
export const findByIdAndDelete = async ({
  model,
  id = "",
  select = "",
  populate = [],
} = {}) => {
  const document = await model
    .findByIdAndDelete(id)
    .select(select)
    .populate(populate);
  return document;
};

export const findOneAndDelete = async ({
  model,
  filter = {},
  select = "",
  populate = [],
} = {}) => {
  const document = await model
    .findOneAndDelete(filter)
    .select(select)
    .populate(populate);
  return document;
};

export const DeleteOne = async ({model, filter = {}} = {}) => {
  const document = await model.DeleteOne(filter);
  return document;
};

export const DeleteMany = async ({model, filter = {}} = {}) => {
  const document = await model.DeleteMany(filter);
  return document;
};
