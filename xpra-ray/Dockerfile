# syntax=docker/dockerfile:1

# This is a pretty complex docker file. It utilizes a cool docker features that creates different builds inside the same dockerfile
# This becomes useful for making smaller docker images. For example this image used to be 4gb, but now is less then 2gb. 
# That is partially because of builds. The first build is completely removed, it just helps install dependencies for the second'
# build to use.


#First Build
FROM mambaorg/micromamba:bullseye-slim AS Build
USER root
RUN apt-get update && apt-get --no-install-recommends -y install x11-apps wget
ENV DEBIAN_FRONTEND noninteractive
# This gets the keys for xpra
RUN apt-get update && wget -O "/usr/share/keyrings/xpra.asc" https://xpra.org/xpra.asc && \
    wget -O "/etc/apt/sources.list.d/xpra.sources" https://raw.githubusercontent.com/Xpra-org/xpra/master/packaging/repos/bullseye/xpra.sources && \
    apt-get remove -y --purge wget

ENV BASH_ENV ~/.bashrc
SHELL ["/bin/bash", "-c"]
COPY ./environment.yml ./environment.yml
RUN micromamba create -y -f ./environment.yml
RUN micromamba clean --all -y \
     && micromamba clean -afy \
     && find /opt/conda/ -follow -type f -name '*.a' -delete \
     && find /opt/conda/ -follow -type f -name '*.pyc' -delete \
     && find /opt/conda/ -follow -type f -name '*.js.map' -delete

#Second Build
FROM mambaorg/micromamba:bullseye-slim
WORKDIR /ray-docker
# copies over the keys from the first Build
COPY --from=Build /usr/share/keyrings/xpra.asc /usr/share/keyrings/xpra.asc
COPY --from=Build /etc/apt/sources.list.d/xpra.sources /etc/apt/sources.list.d/xpra.sources
USER root
ENV DEBIAN_FRONTEND noninteractive
# installs xpra in the smallest way I can manage to install it
RUN apt-get update && \
    apt-get install --no-install-recommends -y xpra xpra-x11 && \
    apt-get autoremove -y --purge && \
    rm -rf /var/lib/apt/lists/*
RUN apt-get update && \
    apt-get install -y --no-install-recommends xpra-html5=16.1 python3-requests && \
    rm -rf /var/lib/apt/lists/*
# COpies over the created conda environment
COPY --from=Build /opt/conda/envs/pyimagej /opt/conda/envs/pyimagej
RUN echo "micromamba activate pyimagej" >> ~/.bashrc
ENV PATH /opt/conda/envs/pyimagej/bin:$PATH
ENV CONDA_DEFAULT_ENV $(head -1 environment.yml | cut -d' ' -f2)
COPY ./macros/ .
# copy xpra config file
COPY ./xpra.conf /etc/xpra/xpra.conf

# set default password
ENV XPRA_PASSWORD xpraPyimagej

# copies over other files
COPY xpra.txt /xpra.txt
COPY ./start_ray.sh ./start_ray.sh
RUN chmod +x ./start_ray.sh
RUN touch /tmp/.X80-lock 

#exposes 2 port numbers. One for Ray and the Other for XPRA.
EXPOSE 8265
EXPOSE 10000
# Start Ray and xpra using this script
CMD ["./start_ray.sh"]