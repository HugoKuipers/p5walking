'''Code for a server with refresh on local file change'''
import os
import webbrowser

from flask import Flask, send_from_directory
from bs4 import BeautifulSoup


def get_files(directory):
    '''
    Get's all the files based on the given directory
    With recursion to find files at all depths
    '''
    files = []
    directory_items = os.listdir(directory)
    for item in directory_items:
        item = os.path.join(directory, item)

        if os.path.isfile(item):
            files.append((item, os.stat(item).st_mtime))

        if os.path.isdir(item):
            files.extend(get_files(item))

    return files


class App(Flask):
    '''The App class to host the server'''

    ROOT = os.path.dirname(os.path.abspath(__file__))
    PORT = 5000
    SCRIPT = "f=_=>fetch('/refresh').then(r => r.json()).then(r => {if(r.refresh) location.reload()}).catch(_=>clearInterval(i));i=setInterval(f,1000)"

    def __init__(self):
        super().__init__(__name__, static_url_path='', static_folder=self.ROOT)
        self.files = get_files(self.ROOT)
        self.url = f'http://localhost:{self.PORT}'

    def start(self):
        '''Starts the server'''
        self.add_url_rule('/', 'index', self.__index)
        self.add_url_rule('/refresh', 'refresh', self.__refresh)
        webbrowser.open_new_tab(self.url)
        self.run(port=self.PORT)

    def __index(self):
        '''Hosts the index file from the root path and adds a script for automatic refresh'''
        with open(os.path.join(self.ROOT, 'index.html')) as index_file:
            soup = BeautifulSoup(
                ''.join(index_file.readlines()), 'html.parser')

        script = soup.new_tag('script')
        script.string = self.SCRIPT
        soup.body.append(script)

        return soup.prettify()

    def __refresh(self):
        '''Checks if a refresh is needed'''
        # TODO :: could do with timestamp so multiple browsers can work with it
        new_files = get_files(self.ROOT)

        if self.files == new_files:
            return {'refresh': False}

        self.files = new_files
        return {'refresh': True}


if __name__ == '__main__':
    App().start()
