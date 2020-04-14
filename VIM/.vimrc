colorscheme desertink

syntax enable "enable syntax matching

"set shortmess+=A "disables existing swap file warning

"set number "shows line numbers
set showcmd "shows last pressed command
set showmatch "matches parenthesis
set textwidth=80 "max width of text

set tabstop=2 "num spaces tab inserts in reading
set softtabstop=2 "num spaces tab inserts in edit
set expandtab "tab inserts spaces instead of tab char
set autoindent

set hlsearch "highlight all search matches
nnoremap q/ :nohlsearch
"filetype indent on "indents automatically for certain files

autocmd FileType make setlocal noexpandtab


nnoremap hhead o<ESC>78I*<ESC>2I/<ESC>3o//<ESC>o<ESC>78I*<ESC>2I/<ESC>

nnoremap replace :%s/\<foo\>/bar/gc
