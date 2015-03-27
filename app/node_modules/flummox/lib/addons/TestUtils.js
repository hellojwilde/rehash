"use strict";

/**
 * Used for simulating actions on stores when testing.
 *
 */
exports.simulateAction = simulateAction;

/**
 * Used for simulating asynchronous actions on stores when testing.
 *
 * asyncAction must be one of the following: begin, success or failure.
 *
 * When simulating the 'begin' action, all arguments after 'begin' will
 * be passed to the action handler in the store.
 *
 * @example
 *
 * TestUtils.simulateActionAsync(store, 'actionId', 'begin', 'arg1', 'arg2');
 * TestUtils.simulateActionAsync(store, 'actionId', 'success', { foo: 'bar' });
 * TestUtils.simulateActionAsync(store, 'actionId', 'failure', new Error('action failed'));
 */
exports.simulateActionAsync = simulateActionAsync;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function simulateAction(store, action, body) {
  var actionId = ensureActionId(action);
  store.handler({ actionId: actionId, body: body });
}

function simulateActionAsync(store, action, asyncAction) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var actionId = ensureActionId(action);
  var payload = {
    actionId: actionId, async: asyncAction
  };

  switch (asyncAction) {
    case "begin":
      if (args.length) {
        payload.actionArgs = args;
      }
      break;
    case "success":
      payload.body = args[0];
      break;
    case "failure":
      payload.error = args[0];
      break;
    default:
      throw new Error("asyncAction must be one of: begin, success or failure");
  }

  store.handler(payload);
}

function ensureActionId(actionOrActionId) {
  return typeof actionOrActionId === "function" ? actionOrActionId._id : actionOrActionId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvVGVzdFV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQUlnQixjQUFjLEdBQWQsY0FBYzs7Ozs7Ozs7Ozs7Ozs7OztRQW1CZCxtQkFBbUIsR0FBbkIsbUJBQW1COzs7OztBQW5CNUIsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbEQsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLE9BQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQyxDQUFDO0NBQ25DOztBQWdCTSxTQUFTLG1CQUFtQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFXO29DQUFOLElBQUk7QUFBSixRQUFJOzs7QUFDckUsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sT0FBTyxHQUFHO0FBQ2QsWUFBUSxFQUFSLFFBQVEsRUFBRSxLQUFLLEVBQUUsV0FBVztHQUM3QixDQUFDOztBQUVGLFVBQU8sV0FBVztBQUNoQixTQUFLLE9BQU87QUFDVixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixlQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztPQUMzQjtBQUNELFlBQU07QUFBQSxBQUNSLFNBQUssU0FBUztBQUNaLGFBQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQU07QUFBQSxBQUNSLFNBQUssU0FBUztBQUNaLGFBQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLFlBQU07QUFBQSxBQUNSO0FBQ0UsWUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO0FBQUEsR0FDNUU7O0FBRUQsT0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUN4Qjs7QUFFRCxTQUFTLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN4QyxTQUFPLE9BQU8sZ0JBQWdCLEtBQUssVUFBVSxHQUN6QyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQ3BCLGdCQUFnQixDQUFDO0NBQ3RCIiwiZmlsZSI6InNyYy9hZGRvbnMvVGVzdFV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2VkIGZvciBzaW11bGF0aW5nIGFjdGlvbnMgb24gc3RvcmVzIHdoZW4gdGVzdGluZy5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaW11bGF0ZUFjdGlvbihzdG9yZSwgYWN0aW9uLCBib2R5KSB7XG4gIGNvbnN0IGFjdGlvbklkID0gZW5zdXJlQWN0aW9uSWQoYWN0aW9uKTtcbiAgc3RvcmUuaGFuZGxlcih7IGFjdGlvbklkLCBib2R5IH0pO1xufVxuXG4vKipcbiAqIFVzZWQgZm9yIHNpbXVsYXRpbmcgYXN5bmNocm9ub3VzIGFjdGlvbnMgb24gc3RvcmVzIHdoZW4gdGVzdGluZy5cbiAqXG4gKiBhc3luY0FjdGlvbiBtdXN0IGJlIG9uZSBvZiB0aGUgZm9sbG93aW5nOiBiZWdpbiwgc3VjY2VzcyBvciBmYWlsdXJlLlxuICpcbiAqIFdoZW4gc2ltdWxhdGluZyB0aGUgJ2JlZ2luJyBhY3Rpb24sIGFsbCBhcmd1bWVudHMgYWZ0ZXIgJ2JlZ2luJyB3aWxsXG4gKiBiZSBwYXNzZWQgdG8gdGhlIGFjdGlvbiBoYW5kbGVyIGluIHRoZSBzdG9yZS5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIFRlc3RVdGlscy5zaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCAnYWN0aW9uSWQnLCAnYmVnaW4nLCAnYXJnMScsICdhcmcyJyk7XG4gKiBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb25Bc3luYyhzdG9yZSwgJ2FjdGlvbklkJywgJ3N1Y2Nlc3MnLCB7IGZvbzogJ2JhcicgfSk7XG4gKiBUZXN0VXRpbHMuc2ltdWxhdGVBY3Rpb25Bc3luYyhzdG9yZSwgJ2FjdGlvbklkJywgJ2ZhaWx1cmUnLCBuZXcgRXJyb3IoJ2FjdGlvbiBmYWlsZWQnKSk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaW11bGF0ZUFjdGlvbkFzeW5jKHN0b3JlLCBhY3Rpb24sIGFzeW5jQWN0aW9uLCAuLi5hcmdzKSB7XG4gIGNvbnN0IGFjdGlvbklkID0gZW5zdXJlQWN0aW9uSWQoYWN0aW9uKTtcbiAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICBhY3Rpb25JZCwgYXN5bmM6IGFzeW5jQWN0aW9uXG4gIH07XG5cbiAgc3dpdGNoKGFzeW5jQWN0aW9uKSB7XG4gICAgY2FzZSAnYmVnaW4nOlxuICAgICAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIHBheWxvYWQuYWN0aW9uQXJncyA9IGFyZ3M7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzdWNjZXNzJzpcbiAgICAgIHBheWxvYWQuYm9keSA9IGFyZ3NbMF07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdmYWlsdXJlJzpcbiAgICAgIHBheWxvYWQuZXJyb3IgPSBhcmdzWzBdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignYXN5bmNBY3Rpb24gbXVzdCBiZSBvbmUgb2Y6IGJlZ2luLCBzdWNjZXNzIG9yIGZhaWx1cmUnKTtcbiAgfVxuXG4gIHN0b3JlLmhhbmRsZXIocGF5bG9hZCk7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUFjdGlvbklkKGFjdGlvbk9yQWN0aW9uSWQpIHtcbiAgcmV0dXJuIHR5cGVvZiBhY3Rpb25PckFjdGlvbklkID09PSAnZnVuY3Rpb24nXG4gICAgPyBhY3Rpb25PckFjdGlvbklkLl9pZFxuICAgIDogYWN0aW9uT3JBY3Rpb25JZDtcbn1cbiJdfQ==