from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import json

from .models import User, Post


def index(request):
    if request.user.is_authenticated:
        posts = Post.objects.all().order_by('-timestamp')
        paginator = Paginator(posts, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, "network/index.html", {"page_obj": page_obj})
    return HttpResponseRedirect(reverse("login"))


@login_required
def following(request):
    if request.user.is_authenticated:
        posts = None
        message = dict()
        try:
            posts = Post.objects.filter(author__followers=request.user.id).order_by('-timestamp')
        except Post.DoesNotExist:
            message["result"] = "Couldn't find any posts."
        paginator = Paginator(posts, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, "network/following.html", {"page_obj": page_obj})
    return HttpResponseRedirect(reverse("login"))


@login_required
def profile(request, user_id):
    if request.user.is_authenticated:
        posts = None
        user_data = None
        message = dict()
        try:
            user_data = User.objects.get(id=user_id).serialize()
        except User.DoesNotExist:
            message["error"] = "User does not exist."

        try:
            posts = Post.objects.filter(author_id=user_id).order_by('-timestamp')
        except Post.DoesNotExist:
            message["result"] = "Couldn't find any posts."

        paginator = Paginator(posts, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, "network/profile.html", {"page_obj": page_obj, "user_data": user_data})
    return HttpResponseRedirect(reverse("login"))


# --------------------------------- LOGIN / REGISTER / LOGOUT ----------------------------------------------------------

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
