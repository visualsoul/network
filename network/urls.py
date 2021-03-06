
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("following/", views.following, name="following"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("create/", views.create, name="create"),
    path("update/<int:post_id>", views.update, name="update"),
    path("post/<int:post_id>", views.post, name="post"),
    path("follow/<int:user_id>", views.follow, name="follow")
]
