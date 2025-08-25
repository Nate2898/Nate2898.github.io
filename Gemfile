# frozen_string_literal: true
source "https://rubygems.org"

gem "jekyll", "~> 4.3.0"
gem "webrick"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

platforms :mswin, :mingw, :x64_mingw do
  gem "wdm", "~> 0.2.0"
end

platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "http_parser.rb", "~> 0.6.0", platforms: [:jruby]

gem "csv", "~> 3.3"

gem "base64", "~> 0.3.0"

gem "logger", "~> 1.7"
