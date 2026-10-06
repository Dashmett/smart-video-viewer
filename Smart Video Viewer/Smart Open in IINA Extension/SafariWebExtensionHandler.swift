//
//  SafariWebExtensionHandler.swift
//  Smart Open in IINA Extension
//
//  Maintained by the Smart Video Viewer contributors.
//

import SafariServices
import AppKit

@available(macOS 10.15, *)
class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let message: Any?
        if #available(iOS 15.0, macOS 11.0, *) {
            message = request?.userInfo?[SFExtensionMessageKey]
        } else {
            message = request?.userInfo?["message"]
        }

        guard
            let payload = message as? [String: Any],
            payload["action"] as? String == "open-in-iina",
            let urlString = payload["url"] as? String,
            let mediaURL = URL(string: urlString),
            ["http", "https"].contains(mediaURL.scheme?.lowercased() ?? "")
        else {
            complete(context, ok: false, error: "Invalid media URL")
            return
        }

        var components = URLComponents()
        components.scheme = "iina"
        components.host = "open"
        components.queryItems = [
            URLQueryItem(name: "url", value: urlString.replacingOccurrences(of: ",", with: "%2C"))
        ]

        guard let iinaURL = components.url, NSWorkspace.shared.open(iinaURL) else {
            complete(context, ok: false, error: "IINA is not installed or rejected the media URL")
            return
        }

        complete(context, ok: true, error: nil)
    }

    private func complete(_ context: NSExtensionContext, ok: Bool, error: String?) {
        var payload: [String: Any] = ["ok": ok]
        if let error { payload["error"] = error }

        let response = NSExtensionItem()
        if #available(macOS 11.0, *) {
            response.userInfo = [SFExtensionMessageKey: payload]
        } else {
            response.userInfo = ["message": payload]
        }
        context.completeRequest(returningItems: [response], completionHandler: nil)
    }

}
