
export function success(res, data = {}, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function error(res, message = 'Error', status = 500) {
  return res.status(status).json({ success: false, message });
}

export function paginated(res, data = [], total = 0, page = 1, limit = 10) {
  return res.status(200).json({
    success: true,
    total,
    page,
    limit,
    data,
  });
}
