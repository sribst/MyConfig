// I think by the time kill_buffer_hook runs the buffer is gone so I
// patch kill_buffer

var kill_buffer_original = kill_buffer_original || kill_buffer;

var killed_buffer_urls = [];

kill_buffer = function (buffer, force) {
    if (buffer.display_uri_string) {
        killed_buffer_urls.push(buffer.display_uri_string);
    }

    kill_buffer_original(buffer,force);
};

interactive("restore-last-killed-buffer-url", "Loads url from a previously killed buffer",
            function restore_killed_buffer_url (I) {
                if (killed_buffer_urls.length !== 0) {
                    load_url_in_new_buffer(killed_buffer_urls.pop());
                } else {
                    I.window.minibuffer.message("No killed buffer urls");
                }
            });

interactive("restore-killed-buffer-url", "Loads url from a previously killed buffer",
            function restore_killed_buffer_url (I) {
                if (killed_buffer_urls.length !== 0) {
                    var url = yield I.minibuffer.read(
                        $prompt = "Restore killed url:",
                        $completer = new all_word_completer($completions = killed_buffer_urls),
                        $default_completion = killed_buffer_urls[killed_buffer_urls.length - 1],
                        $auto_complete = "url",
                        $auto_complete_initial = true,
                        $auto_complete_delay = 0,
                        $require_match = true);

                    load_url_in_new_buffer(url);
                } else {
                    I.window.minibuffer.message("No killed buffer urls");
                }
            });


define_key(content_buffer_normal_keymap, "u", "restore-last-killed-buffer-url");
define_key(content_buffer_normal_keymap, "U", "restore-killed-buffer-url");
