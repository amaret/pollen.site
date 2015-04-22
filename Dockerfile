FROM octohost/jekyll-nginx

RUN gem install kramdown

ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

WORKDIR /srv/www

ADD . /srv/www/
ADD _config_docker.yml /srv/www/_config.yml

RUN jekyll build

EXPOSE 80

CMD nginx

